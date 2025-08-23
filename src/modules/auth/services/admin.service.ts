import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationInput } from "src/database/inputs";
import { ILike, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Admin, Iam } from "../../../database/entities";
import { HashHelper } from "../../../helpers";
import { EmailProducer } from "../../queue/producers/email.producer";
import type {
  AdminRegisterBodyDto,
  CreateIAMUserBodyDto,
  LoginBodyDto,
  PasswordRequestResetBodyDto,
  PasswordResetBodyDto,
  PasswordResetQueryDto,
} from "../dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Iam)
    private iamRepository: Repository<Iam>,
    private jwtService: JwtService,
    private readonly emailProducer: EmailProducer,
  ) {}

  // Mutations
  async registerAdmin({ name, email, password }: AdminRegisterBodyDto) {
    return await this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // find if student already exist
        const existingUser = await transactionalEntityManager.findOne(Admin, {
          where: { email },
        });

        if (existingUser) {
          throw new BadRequestException("Email already exist");
        }

        const user = new Admin();
        user.name = name;
        user.email = email;
        user.password = await HashHelper.encrypt(password);

        const savedUser = await transactionalEntityManager.save(Admin, user);

        return {
          ...savedUser,
        };
      },
    );
  }

  async createIAMUsers({
    iamUsers,
    email,
  }: {
    iamUsers: CreateIAMUserBodyDto[];
    email: string;
  }) {
    return await this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // find if student already exist
        const admin = await transactionalEntityManager.findOne(Admin, {
          where: { email },
          relations: ["iam_users"],
        });

        if (!admin) {
          throw new NotFoundException("This admin does not exist");
        }

        // create iam users
        const newIamUsers: Iam[] = await Promise.all(
          iamUsers.map(async (iamUser) => {
            const newIamUser = new Iam();
            newIamUser.name = iamUser.name;
            newIamUser.iam_identifier = uuidv4().slice(0, 10);
            newIamUser.password = await HashHelper.encrypt(iamUser.password);

            return newIamUser;
          }),
        );

        // perform bulk save for new_workers
        await transactionalEntityManager.save(newIamUsers);

        admin.iam_users = [...admin.iam_users, ...newIamUsers];

        const savedUser = await transactionalEntityManager.save(admin);

        return {
          ...savedUser,
        };
      },
    );
  }

  async updateIAMUser({
    iamIdentifier,
    email,
    name,
    password,
  }: {
    iamIdentifier: string;
    email: string;
    name: string;
    password: string;
  }) {
    return await this.iamRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const iamUser = await transactionalEntityManager.findOne(Iam, {
          where: {
            iam_identifier: iamIdentifier,
            admin: {
              email,
            },
          },
        });

        if (!iamUser) {
          throw new NotFoundException("Iam User does not exist");
        }

        iamUser.name = name || iamUser.name;
        iamUser.password = password
          ? await HashHelper.encrypt(password)
          : iamUser.password;

        return await transactionalEntityManager.save(iamUser);
      },
    );
  }

  async loginIAMUser({
    iamIdentifier,
    password,
  }: {
    iamIdentifier: string;
    password: string;
  }) {
    const iamUser = await this.iamRepository.findOne({
      where: { iam_identifier: iamIdentifier },
      relations: ["admin"],
    });

    if (!iamUser) {
      throw new BadRequestException("Iam identifier or password is incorrect");
    }

    const validateIamPassword = await HashHelper.compare(
      password,
      iamUser.password,
    );

    if (!validateIamPassword) {
      throw new BadRequestException("Iam identifier or password is incorrect");
    }

    const admin = iamUser.admin;

    const payload: {
      id: number;
      name: string;
      email: string;
      role: "ADMIN" | "WORKER";
    } = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "ADMIN",
    };

    const access_token = this.jwtService.sign(payload);

    return {
      ...admin,
      token: access_token,
    };
  }

  async loginAdmin({ email, password }: LoginBodyDto) {
    const user = await this.adminRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException("Email or password is incorrect");
    }

    const validPassowrd = await HashHelper.compare(password, user.password);

    if (!validPassowrd) {
      throw new BadRequestException("Email or password is incorrect");
    }

    if (user.password_reset_code) {
      user.password_reset_code = null;
    }

    const payload: {
      id: number;
      name: string;
      email: string;
      role: "ADMIN" | "WORKER";
    } = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "ADMIN",
    };

    const access_token = this.jwtService.sign(payload);

    return {
      ...user,
      token: access_token,
    };
  }

  async loginAdminWithOTP({
    email,
    otpCode,
  }: {
    email: string;
    otpCode: string;
  }) {
    return await this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await transactionalEntityManager.findOne(Admin, {
          where: { email },
        });

        if (!admin || admin.otp_code !== otpCode) {
          throw new BadRequestException("Email or otp code is incorrect");
        }

        const timeOutValueMs = 10 * 60 * 1000;
        if (
          new Date().valueOf() - new Date(admin.otp_request_date).valueOf() >
          timeOutValueMs
        ) {
          throw new BadRequestException("This OTP Code is timed out");
        }

        admin.otp_code = null;
        admin.otp_request_date = null;

        await transactionalEntityManager.save(admin);

        const payload: {
          id: number;
          name: string;
          email: string;
          role: "ADMIN" | "WORKER";
        } = {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "ADMIN",
        };

        const access_token = this.jwtService.sign(payload);

        return {
          ...admin,
          token: access_token,
        };
      },
    );
  }

  async requestAdminLoginWithOTP({ email }: PasswordRequestResetBodyDto) {
    return await this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await transactionalEntityManager.findOne(Admin, {
          where: { email },
        });

        if (!admin) {
          throw new NotFoundException("Admin email does not exist");
        }

        const otpCode = this.generateOTP();

        admin.otp_code = otpCode;
        admin.otp_request_date = new Date();

        await transactionalEntityManager.save(admin);

        await this.emailProducer.sendOTPCodeByEmail({
          email,
          otpCode,
        });

        if (admin.contact) {
          await this.emailProducer.sendOTPCodeBySMS({
            phoneNumber: admin.contact,
            otpCode,
          });
        }

        return {
          message: "OTP code sent to your email or sms, check to continue!",
        };
      },
    );
  }

  async requestAdminPasswordReset({ email }: PasswordRequestResetBodyDto) {
    return this.requestReset({ email }, Admin, "admin", this.adminRepository);
  }

  async resetAdminPassword({
    email,
    password,
    resetCode,
  }: PasswordResetBodyDto & PasswordResetQueryDto) {
    return await this.resetPassword(
      { email, password, resetCode },
      Admin,
      this.adminRepository,
    );
  }

  // Queries
  async listIAMUsersPaginated({
    email,
    searchTerm,
    pagination,
  }: {
    email: string;
    searchTerm?: string;
    pagination: PaginationInput;
  }) {
    const iamUsers = await this.listIAMUsers({
      email,
      searchTerm,
    });

    // Apply pagination and return in the connection format
    return this.paginate<Iam>(iamUsers, pagination, (iamUser) =>
      iamUser.id.toString(),
    );
  }

  async listIAMUsers({
    email,
    searchTerm,
  }: {
    email: string;
    searchTerm: string;
  }) {
    return this.iamRepository.find({
      where: {
        admin: {
          email,
        },
        name: ILike(`%${searchTerm}%`),
      },
    });
  }

  async getIamUser({
    email,
    iamIdentifier,
  }: {
    email: string;
    iamIdentifier: string;
  }) {
    return this.iamRepository.findOne({
      where: {
        admin: {
          email,
        },
        iam_identifier: iamIdentifier,
      },
    });
  }

  private generateOTP() {
    // Using crypto module for better randomness
    const crypto = require("crypto"); // or import for ES modules
    const buffer = crypto.randomBytes(3); // 3 bytes = 24 bits
    const otp = buffer.readUIntBE(0, 3) % 1000000;
    return otp.toString().padStart(6, "0");
  }

  private async requestReset(
    data: { email },
    Entity,
    entityType,
    repository,
  ): Promise<{ message: string }> {
    return await repository.manager.transaction(
      async (transactionalEntityManager) => {
        const { email } = data;

        const user = await transactionalEntityManager.findOne(Entity, {
          where: { email },
        });

        if (!user) {
          throw new BadRequestException("User not found");
        }

        const resetCode = uuidv4();
        user.password_reset_code = resetCode;

        await transactionalEntityManager.save(Entity, user);

        //Send email message into message queue
        await this.emailProducer.sendPasswordResetEmail({
          email,
          name: user.name,
          resetCode,
          role: entityType,
        });

        return {
          message: "Password reset details sent to your email!",
        };
      },
    );
  }

  private async resetPassword(
    data: { email; password; resetCode },
    Entity,
    repository,
  ): Promise<{ message: string }> {
    return await repository.manager.transaction(
      async (transactionalEntityManager) => {
        const { email, password, resetCode } = data;
        const user = await transactionalEntityManager.findOne(Entity, {
          where: { email },
        });

        if (!user) {
          throw new BadRequestException("User not found");
        }

        if (!user.password_reset_code) {
          throw new BadRequestException("User did not request a reset");
        }

        if (user.password_reset_code !== resetCode) {
          throw new BadRequestException("Incorrect resetCode");
        }

        user.password_reset_code = null;
        user.password = await HashHelper.encrypt(password);
        user.password_reset_date = new Date();
        user.password_reseted = true;

        await transactionalEntityManager.save(Entity, user);

        return {
          message: "Password reset successful",
        };
      },
    );
  }

  async validateGoogleUser(googleUser: LoginBodyDto) {
    const user = await this.adminRepository.findOne({
      where: { email: googleUser.email },
    });

    return user;
  }

  async createGoogleUser({ firstName, lastName, email }) {
    return await this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const name = firstName + " " + lastName;

        // find if student already exist
        const existingUser = await transactionalEntityManager.findOne(Admin, {
          where: { email },
        });

        if (existingUser) {
          throw new BadRequestException("Email already exist");
        }

        const user = new Admin();
        user.name = name;
        user.email = email;
        user.password = await HashHelper.encrypt("password");

        const savedUser = await transactionalEntityManager.save(Admin, user);

        const payload: {
          id: number;
          name: string;
          email: string;
          role: "ADMIN" | "WORKER";
        } = {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          role: "ADMIN",
        };

        return payload;
      },
    );
  }

  private paginate<T>(
    items: T[],
    paginationInput: PaginationInput = {},
    cursorExtractor: (item: T) => string | number,
  ) {
    const { first, after, last, before } = paginationInput;

    // Default values
    const defaultFirst = 10;
    let limit = first || defaultFirst;
    let afterIndex = -1;
    let beforeIndex = items.length;

    // Determine indices based on cursors
    if (after) {
      const decodedCursor = this.decodeCursor(after);
      afterIndex = items.findIndex(
        (item) => String(cursorExtractor(item)) === decodedCursor,
      );
      if (afterIndex === -1)
        afterIndex = -1; // Not found
      else afterIndex = afterIndex; // Include items after this index
    }

    if (before) {
      const decodedCursor = this.decodeCursor(before);
      beforeIndex = items.findIndex(
        (item) => String(cursorExtractor(item)) === decodedCursor,
      );
      if (beforeIndex === -1)
        beforeIndex = items.length; // Not found
      else beforeIndex = beforeIndex; // Include items before this index
    }

    // Handle the 'last' parameter by adjusting the starting point
    if (last) {
      const potentialCount = beforeIndex - afterIndex - 1;
      if (potentialCount > last) {
        afterIndex = beforeIndex - last - 1;
      }
      limit = last;
    }

    // Get the paginated items
    const slicedItems = items.slice(afterIndex + 1, beforeIndex);
    const paginatedItems = slicedItems.slice(0, limit);

    // Create edges with cursors
    const edges = paginatedItems.map((item) => ({
      cursor: this.encodeCursor(String(cursorExtractor(item))),
      node: item,
    }));

    // Determine if there are more pages
    const hasNextPage = beforeIndex > afterIndex + 1 + paginatedItems.length;
    const hasPreviousPage = afterIndex >= 0;

    // Create the pageInfo object
    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    };

    return {
      edges,
      pageInfo,
      count: items.length,
    };
  }

  /**
   * Encode a cursor to Base64
   */
  private encodeCursor(cursor: string): string {
    return Buffer.from(cursor).toString("base64");
  }

  /**
   * Decode a cursor from Base64
   */
  private decodeCursor(cursor: string): string {
    return Buffer.from(cursor, "base64").toString("utf-8");
  }
}

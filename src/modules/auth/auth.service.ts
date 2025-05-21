import { BadRequestException, Injectable } from "@nestjs/common";
import type { RegisterBodyDto } from "src/common/dtos";
import type {
  LoginBodyDto,
  PasswordRequestResetBodyDto,
  PasswordResetBodyDto,
  PasswordResetQueryDto,
} from "./dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HashHelper } from "../../helpers";
import { v4 as uuidv4 } from "uuid";

// Entities
import { Admin, Worker } from "../../database/entities";
import { JwtService } from "@nestjs/jwt";
import { EmailProducer } from "../queue/producers/email.producer";
import { WorkerRole } from "src/database/types/worker.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    private jwtService: JwtService,
    private readonly emailProducer: EmailProducer,
  ) {}
  async registerAdmin({ name, email, password }: RegisterBodyDto) {
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

  async loginWorker({ email, password }: LoginBodyDto) {
    const user = await this.workerRepository.findOne({ where: { email } });

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
      roles: WorkerRole[];
    } = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "WORKER",
      roles: user.roles,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      ...user,
      token: access_token,
    };
  }

  async requestAdminPasswordReset({ email }: PasswordRequestResetBodyDto) {
    return this.requestReset({ email }, Admin, "admin", this.adminRepository);
  }

  async requestWorkerPasswordReset({ email }: PasswordRequestResetBodyDto) {
    return this.requestReset(
      { email },
      Worker,
      "worker",
      this.workerRepository,
    );
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

  async resetWorkerPassword({
    email,
    password,
    resetCode,
  }: PasswordResetBodyDto & PasswordResetQueryDto) {
    return await this.resetPassword(
      { email, password, resetCode },
      Worker,
      this.workerRepository,
    );
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
}

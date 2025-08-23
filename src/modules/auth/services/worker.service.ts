import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkerRole } from "src/database/types/worker.type";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Worker } from "../../../database/entities";
import { HashHelper } from "../../../helpers";
import { EmailProducer } from "../../queue/producers/email.producer";
import {
  LoginBodyDto,
  PasswordRequestResetBodyDto,
  PasswordResetBodyDto,
  PasswordResetQueryDto,
} from "../dto";

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    private jwtService: JwtService,
    private readonly emailProducer: EmailProducer,
  ) {}

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

  async requestWorkerPasswordReset({ email }: PasswordRequestResetBodyDto) {
    return this.requestReset(
      { email },
      Worker,
      "worker",
      this.workerRepository,
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

  async loginWorkerWithOTP({
    email,
    otpCode,
  }: {
    email: string;
    otpCode: string;
  }) {
    return await this.workerRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const worker = await transactionalEntityManager.findOne(Worker, {
          where: { email },
        });

        if (!worker || worker.otp_code !== otpCode) {
          throw new BadRequestException("Email or otp code is incorrect");
        }

        const timeOutValueMs = 10 * 60 * 1000;
        if (
          new Date().valueOf() - new Date(worker.otp_request_date).valueOf() >
          timeOutValueMs
        ) {
          throw new BadRequestException("This OTP Code is timed out");
        }

        worker.otp_code = null;
        worker.otp_request_date = null;

        await transactionalEntityManager.save(worker);

        const payload: {
          id: number;
          name: string;
          email: string;
          role: "ADMIN" | "WORKER";
        } = {
          id: worker.id,
          name: worker.name,
          email: worker.email,
          role: "WORKER",
        };

        const access_token = this.jwtService.sign(payload);

        return {
          ...worker,
          token: access_token,
        };
      },
    );
  }

  async requestWorkerLoginWithOTP({ email }: PasswordRequestResetBodyDto) {
    return await this.workerRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await transactionalEntityManager.findOne(Worker, {
          where: { email },
        });

        if (!admin) {
          throw new NotFoundException("Worker email does not exist");
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
}

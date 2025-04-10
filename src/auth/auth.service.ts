import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { EmailProducer } from "../queue/producers/email.producer";

// Dto's
import { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import { LoginBodyDto } from "./dto/login-body.dto";
import { WorkerDto } from "./dto/create-workers-body.dto";
import { PasswordResetBodyDto } from "./dto/password-reset-body.dto";
import { PasswordResetQueryDto } from "./dto/password-reset-query.dto";

// Entities
import { Admin } from "../entities/admin.entity";
import { Worker } from "../entities/worker.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    private readonly emailProducer: EmailProducer,
    private jwtService: JwtService,
  ) {}
  async createAdmin(createAdminBodyDto: CreateAdminBodyDto) {
    return this.createEntity(createAdminBodyDto, Admin, this.adminRepository);
  }

  async loginAdmin(loginBodyDto: LoginBodyDto) {
    return this.login(loginBodyDto, Admin, "admin", this.adminRepository);
  }

  async loginWorker(loginBodyDto: LoginBodyDto) {
    return this.login(loginBodyDto, Worker, "worker", this.workerRepository);
  }

  async requestAdminPasswordReset({ email }: { email: string }) {
    return this.requestReset({ email }, Admin, "admin", this.adminRepository);
  }

  async requestWorkerPasswordReset({ email }: { email: string }) {
    return this.requestReset(
      { email },
      Worker,
      "worker",
      this.workerRepository,
    );
  }

  async createWorkers(email: string, workers: Array<WorkerDto>) {
    return await this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await transactionalEntityManager.findOne(Admin, {
          where: { email },
          relations: ["workers"],
        });

        if (!admin) {
          throw new BadRequestException("Admin does not exist");
        }

        const new_workers: Worker[] = await Promise.all(
          workers.map(async (worker) => {
            const workerBelongesToAdmin = admin.workers.find(
              (wkr) => wkr.email === worker.email,
            );

            if (workerBelongesToAdmin) {
              return null;
            }

            const workerBelongesToOtherAdmin =
              await this.workerRepository.findOne({
                where: {
                  email: worker.email,
                },
              });

            if (workerBelongesToOtherAdmin) {
              throw new BadRequestException(
                `This email has been used for a worker by a different admin, ${worker.email}`,
              );
            }

            const new_worker = new Worker();
            new_worker.name = worker.name;
            new_worker.email = worker.email;
            new_worker.password = "";
            return this.workerRepository.save(new_worker);
          }),
        );

        admin.workers = [...new_workers, ...admin.workers];

        await transactionalEntityManager.save(Admin, admin);

        return {
          message: "Worker(s) created successfully",
        };
      },
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

  private async createEntity(data: CreateAdminBodyDto, Entity, repository) {
    return await repository.manager.transaction(
      async (transactionalEntityManager) => {
        const { email, name, password } = data;
        // find if student already exist
        const existingUser = await transactionalEntityManager.findOne(Entity, {
          where: { email },
        });

        if (existingUser) {
          throw new BadRequestException("Email already exist");
        }

        const user = new Entity();
        user.name = name;
        user.email = email;
        user.password = await this.hashPassword(password);

        await transactionalEntityManager.save(Entity, user);

        return {
          message: "Successfully signed up",
        };
      },
    );
  }

  private async login(data: LoginBodyDto, Entity, entityType, repository) {
    const { email, password } = data;
    const user = await repository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException("Email or password is incorrect");
    }

    const validPassowrd = await bcrypt.compare(password, user.password);

    if (!validPassowrd) {
      throw new BadRequestException("Email or password is incorrect");
    }

    if (user.password_reset_code) {
      await this.resetPassword(
        {
          email,
          password,
          resetCode: user.password_reset_code,
        },
        Entity,
        repository,
      );
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
      role: entityType.toUpperCase(),
    };

    const access_token = this.jwtService.sign(payload);

    return {
      ...user,
      role: entityType.toUpperCase(),
      token: access_token,
    };
  }

  private async requestReset(data: { email }, Entity, entityType, repository) {
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

        const savedUser = await transactionalEntityManager.save(Entity, user);

        //Send email message into message queue
        await this.emailProducer.sendPasswordResetEmail({
          email,
          name: user.name,
          resetCode,
          role: entityType,
        });

        return {
          ...savedUser,
          message: "Password reset details sent to your email!",
        };
      },
    );
  }

  private async resetPassword(
    data: { email; password; resetCode },
    Entity,
    repository,
  ) {
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
        user.password = await this.hashPassword(password);
        user.password_reset_date = new Date();
        user.password_reseted = true;

        await transactionalEntityManager.save(Entity, user);

        return {
          message: "Password reset successful",
        };
      },
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust this for stronger hashing
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}

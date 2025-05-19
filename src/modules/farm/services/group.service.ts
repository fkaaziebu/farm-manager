import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuditorInput } from "../inputs";
import {
  Admin,
  Farm,
  Group,
  Request,
  Worker,
} from "../../../database/entities";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HashHelper } from "../../../helpers";
import { v4 as uuidv4 } from "uuid";
import { WorkerRole } from "../../../database/types/worker.type";
import { RequestStatus, RequestType } from "../../../database/types";
import { EmailProducer } from "../../queue/producers/email.producer";

@Injectable()
export class GroupService {
  constructor(
    private readonly emailProducer: EmailProducer,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
  ) {}
  async createGroup({ name, email }: { name: string; email: string }) {
    return this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await transactionalEntityManager.findOne(Admin, {
          where: { email },
          relations: ["groups"],
        });

        if (!admin) {
          throw new NotFoundException("Admin does not exist");
        }

        const newGroup = new Group();
        newGroup.name = name;

        const savedGroup = await transactionalEntityManager.save(
          Group,
          newGroup,
        );

        admin.groups.push(savedGroup);

        await transactionalEntityManager.save(Admin, admin);

        return savedGroup;
      },
    );
  }

  async createAuditor({
    email,
    groupId,
    worker,
  }: {
    email: string;
    groupId: string;
    worker: AuditorInput;
  }) {
    return this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const group = await transactionalEntityManager.findOne(Group, {
          where: {
            id: groupId,
            admin: {
              email,
            },
          },
          relations: ["workers"],
        });

        if (!group) {
          throw new NotFoundException("Group not found for this admin");
        }

        const newAuditor = new Worker();
        newAuditor.email = worker.email;
        newAuditor.name = worker.name;
        newAuditor.roles = [WorkerRole.AUDITOR];
        newAuditor.password = await HashHelper.encrypt(uuidv4());

        const savedAuditor = await transactionalEntityManager.save(
          Worker,
          newAuditor,
        );

        group.workers.push(savedAuditor);
        await transactionalEntityManager.save(Group, group);

        return savedAuditor;
      },
    );
  }

  async requestWorkersToJoinGroup({
    email,
    groupId,
    workerEmails,
  }: {
    email: string;
    groupId: string;
    workerEmails: Array<string>;
  }) {
    return this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const group = await transactionalEntityManager.findOne(Group, {
          where: {
            id: groupId,
            admin: {
              email,
            },
          },
          relations: ["requests", "workers"],
        });

        if (!group) {
          throw new NotFoundException("Group not found for this admin");
        }

        workerEmails.map((workerEmail) => {
          if (group.workers.map((wrk) => wrk.email).includes(workerEmail)) {
            throw new BadRequestException(
              `Worker with email: ${workerEmail} already belongs to the group`,
            );
          }
        });

        // check if worker exist in the system
        const workers: Worker[] = await transactionalEntityManager.find(
          Worker,
          {
            where: {
              email: In(workerEmails),
            },
          },
        );

        if (workers.length !== workerEmails.length) {
          const missingEmails = workerEmails.filter(
            (workerEmail) =>
              !workers.map((wrk) => wrk.email).includes(workerEmail),
          );

          throw new NotFoundException(
            `These workers with the emails don't exist: ${missingEmails}`,
          );
        }

        const requests: Request[] = workers.map((wrk) => {
          const newRequest = new Request();
          newRequest.expires_at = new Date();
          newRequest.type = RequestType.WORKER;
          newRequest.worker = wrk;

          return newRequest;
        });

        const savedRequests = await transactionalEntityManager.save(requests);

        group.requests.push(...savedRequests);
        await transactionalEntityManager.save(Group, group);

        savedRequests.map(async (request) => {
          await this.emailProducer.sendGroupJoinRequest({
            email: request.worker.email,
            name: request.worker.name,
            request_id: request.id,
            type: request.type,
          });
        });

        return {
          message: "Request sent successfully",
          code: 200,
        };
      },
    );
  }

  async requestFarmsToJoinGroup({
    email,
    groupId,
    farmTags,
  }: {
    email: string;
    groupId: string;
    farmTags: Array<string>;
  }) {
    return this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const group = await transactionalEntityManager.findOne(Group, {
          where: {
            id: groupId,
            admin: {
              email,
            },
          },
          relations: ["requests", "farms"],
        });

        if (!group) {
          throw new NotFoundException("Group not found for this admin");
        }

        farmTags.map((farmTag) => {
          if (group.farms.map((farm) => farm.farm_tag).includes(farmTag)) {
            throw new BadRequestException(
              `Farm with tag: ${farmTag} already belongs to the group`,
            );
          }
        });

        // check if worker exist in the system
        const farms: Farm[] = await transactionalEntityManager.find(Farm, {
          where: {
            farm_tag: In(farmTags),
          },
          relations: ["admin"],
        });

        if (farms.length !== farmTags.length) {
          const missingFarms = farmTags.filter(
            (farmTag) => !farms.map((farm) => farm.farm_tag).includes(farmTag),
          );

          throw new NotFoundException(
            `These farms with tags don't exist: ${missingFarms}`,
          );
        }

        const requests: Request[] = farms.map((farm) => {
          const newRequest = new Request();
          newRequest.expires_at = new Date();
          newRequest.type = RequestType.FARM;
          newRequest.farm = farm;

          return newRequest;
        });

        const savedRequests = await transactionalEntityManager.save(requests);

        group.requests.push(...savedRequests);
        await transactionalEntityManager.save(Group, group);

        savedRequests.map(async (request) => {
          await this.emailProducer.sendGroupJoinRequest({
            email: request.farm.admin.email,
            name: request.farm.name,
            request_id: request.id,
            type: request.type,
          });
        });

        return {
          message: "Request sent successfully",
          code: 200,
        };
      },
    );
  }

  async acceptRequest({
    email,
    requestId,
    role,
  }: {
    email: string;
    requestId: string;
    role: "ADMIN" | "WORKER";
  }) {
    return this.requestRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const request = await transactionalEntityManager.findOne(Request, {
          where: {
            id: requestId,
          },
          relations: ["farm.admin", "worker", "group.farms", "group.workers"],
        });

        if (!request) {
          throw new NotFoundException("Request not found");
        }

        if (role === "ADMIN" && request.farm.admin.email !== email) {
          throw new UnauthorizedException("You cannot update this request");
        }

        if (role === "WORKER" && request.worker.email !== email) {
          throw new UnauthorizedException("You cannot update this request");
        }

        if (request.status === RequestStatus.ACCEPTED) {
          throw new BadRequestException(
            "You have already accepted this request",
          );
        }

        if (request.status === RequestStatus.DECLINED) {
          throw new BadRequestException(
            "You have already declined this request",
          );
        }

        request.status = RequestStatus.ACCEPTED;
        await transactionalEntityManager.save(Request, request);

        if (role === "ADMIN") {
          request.group.farms.push(request.farm);
        } else {
          request.group.workers.push(request.worker);
        }

        await transactionalEntityManager.save(Group, request.group);

        return {
          message: "Request accepted successfully",
          code: 200,
        };
      },
    );
  }

  async getGroup({ email, groupId }: { email: string; groupId: string }) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
        admin: {
          email,
        },
      },
    });

    if (!group) {
      throw new NotFoundException("Group does not exist for admin");
    }

    return group;
  }

  async getGroupAuditor({
    email,
    groupId,
    workerTag,
  }: {
    email: string;
    groupId: string;
    workerTag: string;
  }) {
    const auditor = await this.workerRepository.findOne({
      where: {
        worker_tag: workerTag,
        groups: {
          id: groupId,
          admin: {
            email,
          },
        },
      },
    });

    if (!auditor) {
      throw new NotFoundException("Auditor does not exist for this admin");
    }

    return auditor;
  }

  async listGroupAuditors({
    email,
    groupId,
  }: {
    email: string;
    groupId: string;
  }) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
        admin: {
          email,
        },
      },
      relations: ["workers"],
    });

    return group.workers;
  }

  async listGroupFarms({ email, groupId }: { email: string; groupId: string }) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
        admin: {
          email,
        },
      },
      relations: ["farms"],
    });

    return group.farms;
  }

  async listGroups({ email }: { email: string }) {
    const admin = await this.adminRepository.findOne({
      where: {
        email,
      },
      relations: ["groups"],
    });

    return admin.groups;
  }
}

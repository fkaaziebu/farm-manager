import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuditorInput, ReportFilterInput, ReportSortInput } from "../inputs";
import {
  Admin,
  Farm,
  Group,
  Report,
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
import { PaginationInput } from "src/database/inputs";

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
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
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

  async createReport({ email, farmTag }: { email: string; farmTag: string }) {
    return this.reportRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            groups: {
              workers: {
                email,
              },
            },
          },
          relations: ["groups.workers.reports", "reports"],
        });

        if (!farm) {
          throw new NotFoundException("Worker does not belong to this farm");
        }

        const new_report = new Report();

        const saved_report = await transactionalEntityManager.save(
          Report,
          new_report,
        );

        farm.reports.push(saved_report);
        farm.groups[0].workers[0].reports.push(saved_report);

        await transactionalEntityManager.save(Farm, farm);
        await transactionalEntityManager.save(Worker, farm.groups[0].workers);

        return saved_report;
      },
    );
  }

  async verifyReport({
    email,
    reportId,
    verificationCode,
    coordinate,
  }: {
    email: string;
    reportId: string;
    verificationCode: string;
    coordinate: {
      lat: number;
      lon: number;
    };
  }) {
    return this.reportRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const report = await transactionalEntityManager.findOne(Report, {
          where: {
            id: reportId,
            worker: {
              email,
            },
          },
          relations: ["farm"],
        });

        if (!report) {
          throw new NotFoundException("Report not found");
        }

        if (report.farm.verification_code !== verificationCode) {
          throw new BadRequestException("QR code is invalid");
        }

        if (report.verified) {
          throw new BadRequestException(
            "This report has already been verified",
          );
        }

        const distanceFromFarm = 0.01;
        const distanceBetweenPoints = this.haversineDistance(
          coordinate.lat,
          coordinate.lon,
          report.farm.latitude,
          report.farm.longitude,
        );

        if (distanceBetweenPoints > distanceFromFarm) {
          throw new BadRequestException("You are not close to the farm");
        }

        report.verified = true;

        return transactionalEntityManager.save(Report, report);
      },
    );
  }

  async completeReport({
    email,
    reportId,
  }: {
    email: string;
    reportId: string;
  }) {
    return this.reportRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const report = await transactionalEntityManager.findOne(Report, {
          where: {
            id: reportId,
            worker: {
              email,
            },
          },
        });

        if (!report) {
          throw new NotFoundException("Report not found");
        }

        if (!report.verified) {
          throw new BadRequestException(
            "This report is not verified, please verify and update before completing",
          );
        }

        report.completed = true;

        return transactionalEntityManager.save(Report, report);
      },
    );
  }

  // QUERIES
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

  async listReportsPaginated({
    email,
    filter,
    pagination,
    sort,
  }: {
    email: string;
    filter?: ReportFilterInput;
    pagination: PaginationInput;
    sort?: ReportSortInput[];
  }) {
    const reports = await this.listReports({ email, sort, filter });

    // Apply pagination and return in the connection format
    return this.paginate<Report>(reports, pagination, (report) =>
      report.id.toString(),
    );
  }

  async listReports({
    email,
    sort,
    filter,
  }: {
    email: string;
    sort?: ReportSortInput[];
    filter?: ReportFilterInput;
  }) {
    const sortOrder = {};
    sort?.map((item) => {
      sortOrder[item.field] = item.direction;
    });

    return this.reportRepository.find({
      where: {
        worker: {
          email,
        },
        id: filter?.reportId,
      },
      relations: ["farm"],
      order: sortOrder,
    });
  }

  async getReport({ email, reportId }: { email: string; reportId: string }) {
    return this.reportRepository.findOne({
      where: {
        worker: {
          email,
        },
        id: reportId,
      },
      relations: ["farm"],
    });
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const toRad = (angle: number) => (angle * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

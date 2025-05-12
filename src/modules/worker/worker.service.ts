import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Farm, Report, Worker } from "../../database/entities";
import { In, Repository } from "typeorm";
import { WorkerRole } from "../../database/types/worker.type";
import { ReportFilterInput, ReportSortInput } from "./inputs";
import { PaginationInput } from "src/database/inputs";
import * as QRCode from "qrcode";

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
  ) {}
  async createReport({ email, farmTag }: { email: string; farmTag: string }) {
    return this.reportRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            workers: {
              email,
            },
          },
          relations: ["workers.reports", "reports"],
        });

        if (!farm) {
          throw new NotFoundException("Worker does not belong to this farm");
        }

        if (!farm.workers[0].roles.includes(WorkerRole.AUDITOR)) {
          throw new UnauthorizedException("This worker is not an AUDITOR");
        }

        const new_report = new Report();

        const saved_report = await transactionalEntityManager.save(
          Report,
          new_report,
        );

        farm.reports.push(saved_report);
        farm.workers[0].reports.push(saved_report);

        await transactionalEntityManager.save(Farm, farm);
        await transactionalEntityManager.save(Worker, farm.workers);

        return saved_report;
      },
    );
  }

  async verifyReport({
    email,
    reportTag,
    verificationCode,
    coordinate,
  }: {
    email: string;
    reportTag: string;
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
            report_tag: reportTag,
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
    reportTag,
  }: {
    email: string;
    reportTag: string;
  }) {
    return this.reportRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const report = await transactionalEntityManager.findOne(Report, {
          where: {
            report_tag: reportTag,
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

  // Queries
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
        report_tag: filter?.reportTag,
      },
      relations: ["farm"],
      order: sortOrder,
    });
  }

  async getReport({ email, reportTag }: { email: string; reportTag: string }) {
    return this.reportRepository.findOne({
      where: {
        worker: {
          email,
        },
        report_tag: reportTag,
      },
      relations: ["farm"],
    });
  }

  async getQrCode({ email, farmTag }: { email: string; farmTag: string }) {
    const farm = await this.farmRepository.findOne({
      where: {
        workers: {
          email,
        },
        farm_tag: farmTag,
      },
      relations: ["workers"],
    });

    if (!farm) {
      throw new NotFoundException("Worker does not belong to this farm");
    }

    if (!farm.workers[0].roles.includes(WorkerRole.AUDITOR)) {
      throw new UnauthorizedException("Worker must not be an auditor");
    }

    const qrBuffer = await this.generate(farm.verification_code);

    const base64 = qrBuffer.toString("base64");

    return { qrCode: `data:image/png;base64,${base64}` };
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

  private async generate(uuid: string): Promise<Buffer> {
    return await QRCode.toBuffer(uuid, {
      type: "png",
      width: 300,
    });
  }
}

import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { EmailService } from "../services/email.service";

@Processor("farm-queue")
export class EmailConsumer extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case "send-password-reset": {
        const { email, name, resetCode, role } = job.data;

        await this.emailService.sendPasswordResetEmail(
          email,
          name,
          resetCode,
          role,
        );

        break;
      }

      case "send-group-join-request": {
        const { email, name, request_id, type } = job.data;

        await this.emailService.sendGroupJoinRequest(
          email,
          name,
          request_id,
          type,
        );

        break;
      }
    }
  }
}

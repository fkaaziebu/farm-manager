import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { EmailProducer } from "./producers/email.producer";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./consumers/email.service";
import { EmailConsumer } from "./consumers/email.consumer";

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: "email-queue",
    }),
  ],
  providers: [EmailProducer, EmailConsumer, EmailService],
  exports: [EmailProducer],
})
export class QueueModule {}

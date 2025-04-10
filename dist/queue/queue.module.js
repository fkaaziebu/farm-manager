"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const email_producer_1 = require("./producers/email.producer");
const config_1 = require("@nestjs/config");
const email_service_1 = require("./consumers/email.service");
const email_consumer_1 = require("./consumers/email.consumer");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            bullmq_1.BullModule.registerQueue({
                name: "email-queue",
            }),
        ],
        providers: [email_producer_1.EmailProducer, email_consumer_1.EmailConsumer, email_service_1.EmailService],
        exports: [email_producer_1.EmailProducer],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map
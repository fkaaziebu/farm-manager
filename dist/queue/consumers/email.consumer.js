"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const email_service_1 = require("./email.service");
let EmailConsumer = class EmailConsumer extends bullmq_1.WorkerHost {
    constructor(emailService) {
        super();
        this.emailService = emailService;
    }
    async process(job) {
        switch (job.name) {
            case "send-password-reset": {
                const { email, name, resetCode, role } = job.data;
                await this.emailService.sendPasswordResetEmail(email, name, resetCode, role);
                break;
            }
        }
    }
};
exports.EmailConsumer = EmailConsumer;
exports.EmailConsumer = EmailConsumer = __decorate([
    (0, bullmq_1.Processor)("email-queue"),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailConsumer);
//# sourceMappingURL=email.consumer.js.map
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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("node:fs");
const path = require("node:path");
const axios_1 = require("axios");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        if (this.configService.get("STAGE") === "prod") {
            this.transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: this.configService.get("GMAIL_USER"),
                    pass: this.configService.get("GMAIL_APP_PASSWORD"),
                },
            });
            this.transporter.verify((error, success) => {
                if (error) {
                    console.error("Email transporter verification failed:", error);
                }
                else {
                    console.log("Email transporter is ready to take messages", success);
                }
            });
        }
        else {
            this.createTestAccount();
        }
    }
    async createTestAccount() {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("EMAIL_HOST"),
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    compileTemplate(templateName, context) {
        const templatePath = path.join(__dirname, "../../..", "/src/queue/consumers/templates", `${templateName}.hbs`);
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const template = handlebars.compile(templateSource);
        return template(context);
    }
    async sendPasswordResetEmail(to, name, resetToken, role) {
        const resetLink = `${this.configService.get("APP_URL", "http://localhost:3000")}/${role}/reset-password?resetCode=${resetToken}`;
        const html = this.compileTemplate("password-reset", { name, resetLink });
        const mailOptions = {
            from: this.configService.get("EMAIL_FROM"),
            subject: "Reset Your Password",
            to,
            html,
        };
        try {
            await this.sendMail(mailOptions.to, mailOptions.subject, "", mailOptions.html);
        }
        catch (error) {
            console.error("Failed to send password reset email:", error);
            throw new Error("Failed to send password reset email");
        }
    }
    async validateEmail(email) {
        const apiKey = this.configService.get("ABSTRACT_API_KEY");
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
        try {
            const response = await axios_1.default.get(url);
            const data = response.data;
            return data.deliverability === "DELIVERABLE";
        }
        catch (error) {
            console.error("Error validating email:", error);
            return false;
        }
    }
    async sendMail(to, subject, text, html) {
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.get("EMAIL_FROM"),
                to,
                subject,
                text,
                html,
            });
            console.log("Activation email sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return info;
        }
        catch (error) {
            console.error("Error sending activation email:", error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map
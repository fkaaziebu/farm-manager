import { ConfigService } from "@nestjs/config";
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    private createTestAccount;
    private compileTemplate;
    sendPasswordResetEmail(to: string, name: string, resetToken: string, role: string): Promise<void>;
    validateEmail(email: string): Promise<boolean>;
    private sendMail;
}

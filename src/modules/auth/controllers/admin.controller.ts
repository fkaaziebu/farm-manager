import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { GoogleAuthGuard } from "../guards/google-auth.guard";
import { ConsentQueryDto } from "../dto/consent-query.dto";
import { ConsentInfoBodyDto } from "../dto/consent-info-body.dto";
import { AdminService } from "../services/admin.service";

@Controller("v1")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @UseGuards(GoogleAuthGuard)
  @Get("/auth/google/login")
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get("/auth/google/callback")
  async googleCallback(@Req() req, @Res() res) {
    if (req.user.needsConsent) {
      // Redirect to consent page
      return res.redirect(
        `/v1/auth/consent?email=${req.user.consentData.email}&firstName=${req.user.consentData.firstName}&lastName=${req.user.consentData.lastName}`,
      );
    }

    const { user } = req;
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "ADMIN",
    };

    const access_token = this.jwtService.sign(payload);
    res.redirect(
      `${this.configService.get<string>("FRONTEND_URL")}/auth/admin/oauth/redirect?token=${access_token}&role=${payload.role.toLowerCase()}&id=${payload.id}`,
    );
  }

  @Get("/auth/consent")
  async showConsentPage(@Query() consentQueryDto: ConsentQueryDto, @Res() res) {
    // Render or redirect to frontend consent page with data

    return res.redirect(
      `${this.configService.get<string>("FRONTEND_URL")}/auth/admin/oauth/consent?email=${consentQueryDto.email}&firstName=${consentQueryDto.firstName}&lastName=${consentQueryDto.lastName}`,
    );
  }

  @Post("/auth/consent")
  async handleConsent(@Body() consentInfo: ConsentInfoBodyDto) {
    const { consent, ...consentData } = consentInfo;

    if (consent === "yes") {
      // Create new user account
      const payload = await this.adminService.createGoogleUser(consentData);

      // Generate JWT
      const access_token = this.jwtService.sign(payload);

      return {
        redirectUrl: `${this.configService.get<string>("FRONTEND_URL")}/auth/admin/oauth/redirect?token=${access_token}&role=${payload.role.toLowerCase()}&id=${payload.id}`,
      };
    }

    return {
      redirectUrl: `${this.configService.get<string>("FRONTEND_URL")}`,
    };
  }
}

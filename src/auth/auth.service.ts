import { Injectable } from "@nestjs/common";
import type { CreateAdminBodyDto } from "./dto/create-admin-body.dto";

@Injectable()
export class AuthService {
  async createAdmin({ name, email, password }: CreateAdminBodyDto) {
    return {
      name,
      email,
      password,
      message: "Admin created successfully",
    };
  }
}

import type { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
export declare class AuthService {
    createAdmin({ name, email, password }: CreateAdminBodyDto): Promise<{
        name: string;
        email: string;
        password: string;
        message: string;
    }>;
}

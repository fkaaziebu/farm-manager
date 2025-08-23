import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import {
  RequestResetResponse,
  ResetResponse,
  WorkerAuthResponse,
} from "./types";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
}

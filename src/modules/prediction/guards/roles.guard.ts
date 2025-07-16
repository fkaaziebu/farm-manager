import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // Create a GraphQL execution context
    const gqlContext = GqlExecutionContext.create(context);
    // Get the user from the GraphQL context
    const { user } = gqlContext.getContext().req;

    // If no user or no role, deny access
    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role.toLowerCase());
  }
}

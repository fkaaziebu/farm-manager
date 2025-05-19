import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlJwtAuthGuard } from "../guards/gql-jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { GroupType, WorkerType } from "src/database/types";
import { WorkerInput } from "../inputs";
import {
  AcceptRequestResponse,
  FarmConnection,
  RequestToJoinResponse,
  WorkerConnection,
} from "../types";
import { GroupConnection } from "../types/group-connection.type";
import { GroupService } from "../services/group.service";

@Resolver()
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}

  // Mutations
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => GroupType)
  createGroup(@Context() context, @Args("name") name: string) {
    const { email } = context.req.user;
    return this.groupService.createGroup({ email, name });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => WorkerType)
  createAuditor(
    @Context() context,
    @Args("groupId") groupId: string,
    @Args("worker", { type: () => WorkerInput!, nullable: false })
    worker: WorkerInput,
  ) {
    const { email } = context.req.user;
    return this.groupService.createAuditor({ email, groupId, worker });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => RequestToJoinResponse)
  requestWorkersToJoinGroup(
    @Context() context,
    @Args("groupId") groupId: string,
    @Args("workerEmails", { type: () => [String!]!, nullable: false })
    workerEmails: string[],
  ) {
    const { email } = context.req.user;
    return this.groupService.requestWorkersToJoinGroup({
      email,
      groupId,
      workerEmails,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => RequestToJoinResponse)
  requestFarmsToJoinGroup(
    @Context() context,
    @Args("groupId") groupId: string,
    @Args("farmTags", { type: () => [String!]!, nullable: false })
    farmTags: string[],
  ) {
    const { email } = context.req.user;
    return this.groupService.requestFarmsToJoinGroup({
      email,
      groupId,
      farmTags,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => AcceptRequestResponse)
  acceptRequest(@Context() context, @Args("requestId") requestId: string) {
    const { email, role } = context.req.user;
    return this.groupService.acceptRequest({
      email,
      requestId,
      role,
    });
  }

  // Queries
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => FarmConnection)
  listGroupFarms(@Context() context, @Args("groupId") groupId: string) {
    const { email } = context.req.user;
    return this.groupService.listGroupFarms({ email, groupId });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => WorkerConnection)
  listGroupAuditors(@Context() context, @Args("groupId") groupId: string) {
    const { email } = context.req.user;
    return this.groupService.listGroupAuditors({ email, groupId });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => WorkerType)
  getGroupAuditor(
    @Context() context,
    @Args("groupId") groupId: string,
    @Args("workerTag") workerTag: string,
  ) {
    const { email } = context.req.user;
    return this.groupService.getGroupAuditor({ email, groupId, workerTag });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => GroupType)
  getGroup(@Context() context, @Args("groupId") groupId: string) {
    const { email } = context.req.user;
    return this.groupService.getGroup({ email, groupId });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => GroupConnection)
  listGroups(@Context() context) {
    const { email } = context.req.user;
    return this.groupService.listGroups({ email });
  }
}

import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { WorkerType } from "./worker.type";
import { GroupType } from "./group.type";

export enum RequestStatus {
  PENDING = "PENDING",
  DECLINED = "DECLINED",
  ACCEPTED = "ACCEPTED",
}

export enum RequestType {
  WORKER = "WORKER",
  FARM = "FARM",
}

registerEnumType(RequestStatus, {
  name: "RequestStatus",
  description: "Whether it is pending, declined or accepted",
});

registerEnumType(RequestType, {
  name: "RequestType",
  description: "This specifies the entity we are sending the request to",
});

@ObjectType("Request")
export class RequestTypeClass {
  @Field(() => ID)
  id: string;

  @Field(() => RequestStatus)
  status: RequestStatus;

  @Field(() => RequestType)
  type: RequestType;

  @Field()
  expires_at: Date;

  @Field(() => WorkerType, { nullable: true })
  worker?: WorkerType;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => GroupType, { nullable: true })
  group?: GroupType;
}

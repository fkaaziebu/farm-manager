import { Field, InputType } from "@nestjs/graphql";
import { WorkerRole } from "../../../database/types/worker.type";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class UpdateWorkerInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  join_date?: Date;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  bio?: any;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  achievements?: any[];

  @Field(() => [WorkerRole], { nullable: true })
  roles?: WorkerRole[];
}

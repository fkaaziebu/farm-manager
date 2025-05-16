import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";

@ObjectType("Review")
export class ReviewType {
  @Field(() => ID)
  id: number;

  @Field()
  description: string;

  @Field()
  rating: number;

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => WorkerType, { nullable: true })
  worker?: WorkerType;

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;
}

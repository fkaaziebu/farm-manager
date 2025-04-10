import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";
import { AnimalType } from "./animal.type";
import { HouseType } from "./house.type";

@ObjectType("Farm")
export class FarmType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  area: string;

  @Field()
  performance: number;

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];

  @Field(() => [HouseType], { nullable: true })
  houses?: HouseType[];

  @Field(() => [AnimalType], { nullable: true })
  animals?: AnimalType[];
}

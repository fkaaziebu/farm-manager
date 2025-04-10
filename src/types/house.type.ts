import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { RoomType } from "./room.type";
import { FarmType } from "./farm.type";
import { HouseStatus } from "src/entities/house.entity";

registerEnumType(HouseStatus, {
  name: "HouseStatus",
});

@ObjectType("House")
export class HouseType {
  @Field(() => ID)
  id: number;

  @Field()
  house_number: string;

  @Field()
  type: string;

  @Field(() => HouseStatus)
  status: HouseStatus;

  @Field(() => FarmType, { nullable: true })
  farm?: FarmType;

  @Field(() => [RoomType], { nullable: true })
  rooms?: RoomType[];
}

import { Field, ID, ObjectType } from "@nestjs/graphql";
import { HouseType } from "./house.type";
import { AnimalType } from "./animal.type";

@ObjectType("Room")
export class RoomType {
  @Field(() => ID)
  id: number;

  @Field()
  room_number: string;

  @Field(() => HouseType, { nullable: true })
  house?: HouseType;

  @Field(() => [AnimalType], { nullable: true })
  animals?: AnimalType[];
}

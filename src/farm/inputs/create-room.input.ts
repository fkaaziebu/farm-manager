import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateRoomInput {
  @Field()
  room_number: string;
}

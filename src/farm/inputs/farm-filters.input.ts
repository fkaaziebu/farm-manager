import { Field, InputType } from "@nestjs/graphql";
import { IntFilterInput } from "./int-filter.input";
import { StringFilterInput } from "./string-filter.input";
import { BooleanFilterInput } from "./boolean-filter.input";
import { DateFilterInput } from "./date-filter.input";

@InputType()
export class AdminFilterInput {
  @Field(() => IntFilterInput, { nullable: true })
  id?: IntFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  email?: StringFilterInput;
}

@InputType()
export class WorkerFilterInput {
  @Field(() => IntFilterInput, { nullable: true })
  id?: IntFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  email?: StringFilterInput;
}

@InputType()
export class HouseFilterInput {
  @Field(() => IntFilterInput, { nullable: true })
  id?: IntFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  house_number?: StringFilterInput;
}

@InputType()
export class RoomFilterInput {
  @Field(() => IntFilterInput, { nullable: true })
  id?: IntFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  room_number?: StringFilterInput;
}

@InputType()
export class AnimalFilterInput {
  @Field(() => IntFilterInput, { nullable: true })
  id?: IntFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  tag_number?: StringFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  gender?: StringFilterInput;

  @Field(() => DateFilterInput, { nullable: true })
  birth_date?: DateFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  breed?: StringFilterInput;

  @Field(() => IntFilterInput, { nullable: true })
  weight?: IntFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  health_status?: StringFilterInput;

  @Field(() => BooleanFilterInput, { nullable: true })
  available?: BooleanFilterInput;
}

@InputType()
export class FarmFilterInput {
  @Field(() => IntFilterInput, { nullable: true })
  id?: IntFilterInput;

  @Field(() => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @Field(() => AdminFilterInput, { nullable: true })
  admin?: AdminFilterInput;

  @Field(() => WorkerFilterInput, { nullable: true })
  worker?: WorkerFilterInput;

  @Field(() => HouseFilterInput, { nullable: true })
  house?: HouseFilterInput;

  @Field(() => AnimalFilterInput, { nullable: true })
  animal?: AnimalFilterInput;

  @Field(() => IntFilterInput, { nullable: true })
  houseCount?: IntFilterInput;

  @Field(() => IntFilterInput, { nullable: true })
  animalCount?: IntFilterInput;

  @Field(() => IntFilterInput, { nullable: true })
  workerCount?: IntFilterInput;
}

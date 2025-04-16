import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class BarnInput {
  @Field()
  unitId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  buildingMaterial?: string;

  @Field()
  climateControlled: boolean;

  @Field({ nullable: true })
  constructionDate?: Date;

  @Field()
  areaSqm: number;

  @Field({ nullable: true })
  ventilationType?: string;

  @Field()
  capacity: number;
}

import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GreenhouseInput {
  @Field()
  unitId: string;

  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field()
  areaSqm: number;

  @Field({ nullable: true })
  constructionDate?: Date;

  @Field({ nullable: true })
  coveringMaterial?: string;

  @Field({ nullable: true })
  temperatureControl?: string;

  @Field({ nullable: true })
  lightingSystem?: string;

  @Field({ nullable: true })
  irrigationSystem?: string;

  @Field({ nullable: true })
  climateControlled?: boolean;

  @Field({ nullable: true })
  ventilationSystem?: string;
}

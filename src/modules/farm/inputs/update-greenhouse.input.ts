import { Field, InputType } from "@nestjs/graphql";
import { HousingStatus } from "src/database/types/housing-status.enum";

@InputType()
export class UpdateGreenhouseInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  capacity?: number;

  @Field({ nullable: true })
  areaSqm?: number;

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

  @Field(() => HousingStatus, { nullable: true })
  status?: HousingStatus;
}

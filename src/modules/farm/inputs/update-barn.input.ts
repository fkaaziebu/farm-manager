import { Field, InputType } from "@nestjs/graphql";
import { HousingStatus } from "src/database/types/housing-status.enum";

@InputType()
export class UpdateBarnInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  buildingMaterial?: string;

  @Field({ nullable: true })
  climateControlled?: boolean;

  @Field({ nullable: true })
  constructionDate?: Date;

  @Field({ nullable: true })
  areaSqm?: number;

  @Field({ nullable: true })
  ventilationType?: string;

  @Field({ nullable: true })
  capacity?: number;

  @Field(() => HousingStatus, { nullable: true })
  status?: HousingStatus;
}

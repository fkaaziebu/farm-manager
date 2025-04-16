import { Field, InputType } from "@nestjs/graphql";
import { HousingStatus } from "src/database/types/housing-status.enum";

@InputType()
export class UpdatePenInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  areaSqm?: number;

  @Field({ nullable: true })
  beddingType?: string;

  @Field({ nullable: true })
  capacity?: number;

  @Field({ nullable: true })
  feederType?: string;

  @Field({ nullable: true })
  watererType?: string;

  @Field(() => HousingStatus, { nullable: true })
  status?: HousingStatus;
}

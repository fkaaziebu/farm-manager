import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PenInput {
  @Field()
  unitId: string;

  @Field()
  name: string;

  @Field()
  areaSqm: number;

  @Field({ nullable: true })
  beddingType: string;

  @Field()
  capacity: string;

  @Field({ nullable: true })
  feederType: string;

  @Field({ nullable: true })
  watererType: string;
}

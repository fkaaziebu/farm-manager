import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AnimalType } from "./animal.type";

@ObjectType("SalesRecord")
export class SalesRecordType {
  @Field(() => ID)
  id: number;

  @Field()
  buyer_name: string;

  @Field()
  sale_date: Date;

  @Field()
  price_sold: number;

  @Field({ nullable: true })
  expenses?: number;

  @Field()
  notes: string;

  @Field(() => AnimalType, { nullable: true })
  animal?: AnimalType;
}

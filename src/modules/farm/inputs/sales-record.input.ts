import { Field, InputType } from "@nestjs/graphql";
import { ProductType } from "../../../database/types/sales-record.type";

@InputType()
export class SalesRecordInput {
  @Field()
  buyerName: string;

  @Field({ nullable: true })
  expenses?: number;

  @Field()
  notes: string;

  @Field()
  pricePerUnit: number;

  @Field()
  quantity: number;

  @Field()
  saleDate: Date;

  @Field()
  totalAmount: number;

  @Field()
  unit: string;
}

import { Field, InputType } from "@nestjs/graphql";
import { ProductType } from "../../../database/types/sales-record.type";

@InputType()
export class UpdateSalesRecordInput {
  @Field({ nullable: true })
  buyerName?: string;

  @Field({ nullable: true })
  expenses?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  pricePerUnit?: number;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  saleDate?: Date;

  @Field({ nullable: true })
  totalAmount?: number;

  @Field({ nullable: true })
  unit?: string;
}

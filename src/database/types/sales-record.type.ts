import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LivestockTypeClass } from "./livestock.type";
import { PoultryBatchType } from "./poultry-batch.type";
import { AquacultureBatchType } from "./aquaculture-batch.type";
import { CropBatchType } from "./crop-batch.type";
import { HiveType } from "./hive.type";
import { FarmTypeClass } from "./farm.type";

export enum ProductType {
  LIVESTOCK = "LIVESTOCK",
  POULTRY = "POULTRY",
  FISH = "FISH",
  CROP = "CROP",
  HONEY = "HONEY",
  OTHER = "OTHER",
}

registerEnumType(ProductType, {
  name: "ProductType",
  description: "Type of product being sold",
});

@ObjectType("SalesRecord")
export class SalesRecordType {
  @Field(() => ID)
  id: number;

  @Field()
  buyer_name: string;

  @Field()
  sale_date: Date;

  @Field(() => ProductType)
  product_type: ProductType;

  @Field()
  quantity: number;

  @Field()
  unit: string;

  @Field()
  price_per_unit: number;

  @Field()
  total_amount: number;

  @Field({ nullable: true })
  expenses?: number;

  @Field()
  notes: string;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => LivestockTypeClass, { nullable: true })
  livestock?: LivestockTypeClass;

  @Field(() => PoultryBatchType, { nullable: true })
  poultry_batch?: PoultryBatchType;

  @Field(() => AquacultureBatchType, { nullable: true })
  aquaculture_batch?: AquacultureBatchType;

  @Field(() => CropBatchType, { nullable: true })
  crop_batch?: CropBatchType;

  @Field(() => HiveType, { nullable: true })
  hive?: HiveType;
}

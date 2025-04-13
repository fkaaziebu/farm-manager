import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Livestock } from "./livestock.entity";
import { PoultryBatch } from "./poultry-batch.entity";
import { AquacultureBatch } from "./aquaculture-batch.entity";
import { CropBatch } from "./crop-batch.entity";
import { Hive } from "./hive.entity";
import { Farm } from "./farm.entity";

export enum ProductType {
  LIVESTOCK = "LIVESTOCK",
  POULTRY = "POULTRY",
  FISH = "FISH",
  CROP = "CROP",
  HONEY = "HONEY",
  OTHER = "OTHER",
}

@Entity("sales_records")
export class SalesRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyer_name: string;

  @Column()
  sale_date: Date;

  @Column({
    type: "enum",
    enum: ProductType,
  })
  product_type: ProductType;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column()
  price_per_unit: number;

  @Column()
  total_amount: number;

  @Column({ default: null })
  expenses: number;

  @Column()
  notes: string;

  @ManyToOne(() => Farm)
  farm: Farm;

  // Product references
  @ManyToOne(() => Livestock, { nullable: true })
  livestock: Livestock;

  @ManyToOne(() => PoultryBatch, (poultryBatch) => poultryBatch.sales_records, {
    nullable: true,
  })
  poultry_batch: PoultryBatch;

  @ManyToOne(
    () => AquacultureBatch,
    (aquacultureBatch) => aquacultureBatch.sales_records,
    { nullable: true },
  )
  aquaculture_batch: AquacultureBatch;

  @ManyToOne(() => CropBatch, (cropBatch) => cropBatch.sales_records, {
    nullable: true,
  })
  crop_batch: CropBatch;

  @ManyToOne(() => Hive, (hive) => hive.sales_record, { nullable: true })
  hive: Hive;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Livestock } from "./livestock.entity";
import { PoultryBatch } from "./poultry-batch.entity";
import { AquacultureBatch } from "./aquaculture-batch.entity";
import { CropBatch } from "./crop-batch.entity";
import { Hive } from "./hive.entity";
import { HousingUnit } from "./housing-unit.entity";

export enum ExpenseCategory {
  // General categories
  FEED = "FEED",
  MEDICAL = "MEDICAL",
  VACCINATION = "VACCINATION",
  SUPPLEMENTS = "SUPPLEMENTS",
  TESTING = "TESTING",
  TRANSPORT = "TRANSPORT",
  EQUIPMENT = "EQUIPMENT",
  MAINTENANCE = "MAINTENANCE",
  UTILITIES = "UTILITIES",
  LABOR = "LABOR",

  // Livestock specific
  BREEDING = "BREEDING",
  IDENTIFICATION = "IDENTIFICATION",
  GROOMING = "GROOMING",

  // Crop specific
  FERTILIZER = "FERTILIZER",
  PESTICIDE = "PESTICIDE",
  HERBICIDE = "HERBICIDE",
  SEEDS = "SEEDS",
  IRRIGATION = "IRRIGATION",
  HARVESTING = "HARVESTING",

  // Housing related
  HOUSING = "HOUSING",
  BEDDING = "BEDDING",
  CLEANING = "CLEANING",

  // Other
  OTHER = "OTHER",
}

@Entity("expense_records")
export class ExpenseRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ExpenseCategory,
    default: ExpenseCategory.FEED,
  })
  category: ExpenseCategory;

  @Column()
  expense_date: Date;

  @Column()
  amount: number;

  @Column()
  notes: string;

  // Farm product references
  @ManyToOne(() => Livestock, (livestock) => livestock.expense_records, {
    nullable: true,
  })
  livestock: Livestock;

  @ManyToOne(
    () => PoultryBatch,
    (poultryBatch) => poultryBatch.expense_records,
    { nullable: true },
  )
  poultry_batch: PoultryBatch;

  @ManyToOne(
    () => AquacultureBatch,
    (aquacultureBatch) => aquacultureBatch.expense_records,
    { nullable: true },
  )
  aquaculture_batch: AquacultureBatch;

  @ManyToOne(() => CropBatch, (cropBatch) => cropBatch.expense_records, {
    nullable: true,
  })
  crop_batch: CropBatch;

  @ManyToOne(() => Hive, (hive) => hive.expense_records, { nullable: true })
  hive: Hive;

  // Housing reference
  @ManyToOne(() => HousingUnit, (housingUnit) => housingUnit.expense_records, {
    nullable: true,
  })
  housing_unit: HousingUnit;
}

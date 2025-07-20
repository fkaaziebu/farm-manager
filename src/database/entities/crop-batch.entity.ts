import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";
import { SalesRecord } from "./sales-record.entity";
import { Field } from "./field.entity";
import { Greenhouse } from "./greenhouse.entity";

export enum CropType {
  GRAIN = "GRAIN",
  VEGETABLE = "VEGETABLE",
  FRUIT = "FRUIT",
  LEGUME = "LEGUME",
  ROOT = "ROOT",
  TUBER = "TUBER",
  FODDER = "FODDER",
  FIBER = "FIBER",
  OIL = "OIL",
  HERB = "HERB",
  SPICE = "SPICE",
  OTHER = "OTHER",
}

export enum CropKind {
  MAIZE = "MAIZE",
  CASHEW = "CASHEW",
  CASSAVA = "CASSAVA",
  TOMATO = "TOMATO",
}

export enum CropStatus {
  SEEDLING = "SEEDLING",
  GROWING = "GROWING",
  FLOWERING = "FLOWERING",
  FRUITING = "FRUITING",
  READY_FOR_HARVEST = "READY_FOR_HARVEST",
  HARVESTED = "HARVESTED",
  FAILED = "FAILED",
}

export enum PlantingMethod {
  DIRECT_SEEDING = "DIRECT_SEEDING",
  TRANSPLANTING = "TRANSPLANTING",
  CUTTING = "CUTTING",
  GRAFTING = "GRAFTING",
  LAYERING = "LAYERING",
  DIVISION = "DIVISION",
}

export enum IrrigationMethod {
  DRIP = "DRIP",
  SPRINKLER = "SPRINKLER",
  FLOOD = "FLOOD",
  FURROW = "FURROW",
  RAIN_FED = "RAIN_FED",
  MANUAL = "MANUAL",
}

@Entity("crop_batches")
export class CropBatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: "uuid" })
  crop_batch_tag: string;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: CropType,
    default: CropType.VEGETABLE,
  })
  crop_type: CropType;

  @Column({
    type: "enum",
    enum: CropKind,
    default: null,
  })
  crop_kind: CropKind;

  @Column()
  variety: string;

  @Column()
  planting_date: Date;

  @Column({ nullable: true })
  harvest_date: Date;

  @Column({ default: null, type: "json" })
  gps_coordinates: object;

  @Column({
    type: "enum",
    enum: PlantingMethod,
    default: PlantingMethod.DIRECT_SEEDING,
  })
  planting_method: PlantingMethod;

  @Column({
    type: "enum",
    enum: IrrigationMethod,
    default: IrrigationMethod.RAIN_FED,
  })
  irrigation_method: IrrigationMethod;

  @Column({ default: 0 })
  area_planted: number;

  @Column({ default: "hr" })
  area_unit: string;

  @Column({ default: 0 })
  plants_count: number;

  @Column({ default: 0 })
  seed_amount: number;

  @Column({ default: null })
  seed_unit: string;

  @Column({ default: 0 })
  expected_yield: number;

  @Column({ default: 0 })
  actual_yield: number;

  @Column({ default: null })
  yield_unit: string;

  @Column({ default: null, type: "json" })
  fertilizer_applications: object;

  @Column({ default: null, type: "json" })
  pesticide_applications: object;

  @Column({ default: null, type: "json" })
  weather_conditions: object;

  @Column({
    type: "enum",
    enum: CropStatus,
    default: CropStatus.SEEDLING,
  })
  status: CropStatus;

  @ManyToOne(() => Farm, (farm) => farm.crop_batches)
  farm: Farm;

  @ManyToOne(() => Field, (field) => field.crop_batches, { nullable: true })
  field: Field;

  @ManyToOne(() => Greenhouse, (greenhouse) => greenhouse.crop_batches, {
    nullable: true,
  })
  greenhouse: Greenhouse;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.crop_batch)
  expense_records: ExpenseRecord[];

  @OneToMany(() => SalesRecord, (sales_record) => sales_record.crop_batch)
  sales_records: SalesRecord[];

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

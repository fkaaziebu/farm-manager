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
import { HealthRecord } from "./health-record.entity";
import { GrowthRecord } from "./growth-record.entity";
import { Pond } from "./pond.entity";

export enum AquaticType {
  FISH = "FISH",
  SHRIMP = "SHRIMP",
  CRAB = "CRAB",
  OYSTER = "OYSTER",
  OTHER = "OTHER",
}

export enum WaterType {
  FRESHWATER = "FRESHWATER",
  SALTWATER = "SALTWATER",
  BRACKISH = "BRACKISH",
}

export enum BatchHealthStatus {
  HEALTHY = "HEALTHY",
  MINOR_ISSUES = "MINOR_ISSUES",
  OUTBREAK = "OUTBREAK",
  RECOVERING = "RECOVERING",
  QUARANTINED = "QUARANTINED",
}

@Entity("aquaculture_batches")
export class AquacultureBatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  batch_id: string;

  @Column({
    type: "enum",
    enum: AquaticType,
    default: AquaticType.FISH,
  })
  aquatic_type: AquaticType;

  @Column()
  species: string;

  @Column({
    type: "enum",
    enum: WaterType,
    default: WaterType.FRESHWATER,
  })
  water_type: WaterType;

  @Column()
  stocking_date: Date;

  @Column()
  initial_count: number;

  @Column({ default: 0 })
  current_count: number;

  @Column({ default: 0 })
  mortality_count: number;

  @Column({ default: 0 })
  harvested_count: number;

  @Column({ default: 0 })
  average_weight: number;

  @Column({ default: 0 })
  feed_consumption_kg: number;

  @Column({ default: 0 })
  feed_conversion_ratio: number;

  @Column({ default: null, type: "json" })
  water_parameters: object;

  @Column({ default: 0 })
  stocking_density: number;

  @Column({
    type: "enum",
    enum: BatchHealthStatus,
    default: BatchHealthStatus.HEALTHY,
  })
  health_status: BatchHealthStatus;

  @ManyToOne(() => Farm, (farm) => farm.aquaculture_batches)
  farm: Farm;

  @ManyToOne(() => Pond, (pond) => pond.aquaculture_batches)
  pond: Pond;

  @OneToMany(
    () => ExpenseRecord,
    (expense_record) => expense_record.aquaculture_batch,
  )
  expense_records: ExpenseRecord[];

  @OneToMany(
    () => HealthRecord,
    (health_record) => health_record.aquaculture_batch,
  )
  health_records: HealthRecord[];

  @OneToMany(
    () => SalesRecord,
    (sales_record) => sales_record.aquaculture_batch,
  )
  sales_records: SalesRecord[];

  @OneToMany(
    () => GrowthRecord,
    (growth_record) => growth_record.aquaculture_batch,
  )
  growth_records: GrowthRecord[];

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

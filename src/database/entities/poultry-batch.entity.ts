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
import { Coop } from "./coop.entity";

export enum PoultryType {
  CHICKEN = "CHICKEN",
  DUCK = "DUCK",
  TURKEY = "TURKEY",
  QUAIL = "QUAIL",
  OTHER = "OTHER",
}

export enum PoultryPurpose {
  MEAT = "MEAT",
  EGGS = "EGGS",
  DUAL_PURPOSE = "DUAL_PURPOSE",
  BREEDING = "BREEDING",
}

export enum BatchHealthStatus {
  HEALTHY = "HEALTHY",
  MINOR_ISSUES = "MINOR_ISSUES",
  OUTBREAK = "OUTBREAK",
  RECOVERING = "RECOVERING",
  QUARANTINED = "QUARANTINED",
}

@Entity("poultry_batches")
export class PoultryBatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  batch_id: string;

  @Column({
    type: "enum",
    enum: PoultryType,
    default: PoultryType.CHICKEN,
  })
  poultry_type: PoultryType;

  @Column()
  breed: string;

  @Column({
    type: "enum",
    enum: PoultryPurpose,
    default: PoultryPurpose.MEAT,
  })
  purpose: PoultryPurpose;

  @Column()
  hatch_date: Date;

  @Column()
  initial_count: number;

  @Column({ default: 0 })
  current_count: number;

  @Column({ default: 0 })
  mortality_count: number;

  @Column({ default: 0 })
  sold_count: number;

  @Column({ default: 0 })
  average_weight: number;

  @Column({ default: 0 })
  feed_consumption_kg: number;

  @Column({ default: 0 })
  egg_production: number;

  @Column({ default: 0 })
  feed_conversion_ratio: number;

  @Column({
    type: "enum",
    enum: BatchHealthStatus,
    default: BatchHealthStatus.HEALTHY,
  })
  health_status: BatchHealthStatus;

  @ManyToOne(() => Farm, (farm) => farm.poultry_batches)
  farm: Farm;

  @ManyToOne(() => Coop, (coop) => coop.poultry_batches)
  coop: Coop;

  @OneToMany(
    () => ExpenseRecord,
    (expense_record) => expense_record.poultry_batch,
  )
  expense_records: ExpenseRecord[];

  @OneToMany(() => HealthRecord, (health_record) => health_record.poultry_batch)
  health_records: HealthRecord[];

  @OneToMany(() => SalesRecord, (sales_record) => sales_record.poultry_batch)
  sales_records: SalesRecord[];

  @OneToMany(() => GrowthRecord, (growth_record) => growth_record.poultry_batch)
  growth_records: GrowthRecord[];

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

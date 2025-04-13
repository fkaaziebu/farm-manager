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
import { Apiary } from "./apiary.entity";

export enum HiveStatus {
  ACTIVE = "ACTIVE",
  WEAK = "WEAK",
  STRONG = "STRONG",
  COLLAPSED = "COLLAPSED",
  SWARMING = "SWARMING",
}

@Entity("hives")
export class Hive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  hive_id: string;

  @Column()
  queen_age: number;

  @Column({ default: 0 })
  honey_production: number;

  @Column({ default: 0 })
  wax_production: number;

  @Column({ default: 0 })
  pollen_collection: number;

  @Column({
    type: "enum",
    enum: HiveStatus,
    default: HiveStatus.ACTIVE,
  })
  status: HiveStatus;

  @Column({ default: 0 })
  bee_population: number;

  @Column({ default: null })
  last_inspection: Date;

  @ManyToOne(() => Farm, (farm) => farm.hives)
  farm: Farm;

  @ManyToOne(() => Apiary, (apiary) => apiary.hives)
  apiary: Apiary;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.hive)
  expense_records: ExpenseRecord[];

  @ManyToOne(() => SalesRecord, (sales_record) => sales_record.hive)
  sales_record: SalesRecord;

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

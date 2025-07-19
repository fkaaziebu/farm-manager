import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { CropBatch } from "./crop-batch.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";

export enum CropHousingStatus {
  ACTIVE = "ACTIVE",
  FALLOW = "FALLOW",
  PREPARATION = "PREPARATION",
  MAINTENANCE = "MAINTENANCE",
}

@Entity("fields")
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  unit_id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  capacity: number;

  @Column({
    type: "enum",
    enum: CropHousingStatus,
    default: CropHousingStatus.ACTIVE,
  })
  status: CropHousingStatus;

  @Column({ default: 0 })
  area_hectares: number;

  @Column({ default: null })
  soil_type: string;

  @Column({ default: null })
  irrigation_type: string;

  @Column({ default: null })
  slope: string;

  @Column({ default: null })
  drainage: string;

  @Column({ default: null, type: "json" })
  soil_test_results: object;

  @Column({ default: null })
  previous_crop: string;

  @ManyToOne(() => Farm, (farm) => farm.fields)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.field)
  expense_records: ExpenseRecord[];

  @OneToMany(() => CropBatch, (cropBatch) => cropBatch.field)
  crop_batches: CropBatch[];
}

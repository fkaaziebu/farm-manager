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

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity()
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
    enum: HousingStatus,
    default: HousingStatus.OPERATIONAL,
  })
  status: HousingStatus;

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

  @Column({ default: null, type: "json" })
  gps_coordinates: object;

  @ManyToOne(() => Farm, (farm) => farm.fields)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.field)
  expense_records: ExpenseRecord[];

  @OneToMany(() => CropBatch, (cropBatch) => cropBatch.field)
  crop_batches: CropBatch[];
}

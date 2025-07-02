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
import { CropHousingStatus } from "./field.entity";

@Entity()
export class Greenhouse {
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
  area_sqm: number;

  @Column({ default: null })
  construction_date: Date;

  @Column({ default: null })
  covering_material: string;

  @Column({ default: null })
  temperature_control: string;

  @Column({ default: null })
  lighting_system: string;

  @Column({ default: null })
  irrigation_system: string;

  @Column({ default: false })
  climate_controlled: boolean;

  @Column({ default: null })
  ventilation_system: string;

  @ManyToOne(() => Farm, (farm) => farm.greenhouses)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.greenhouse)
  expense_records: ExpenseRecord[];

  @OneToMany(() => CropBatch, (cropBatch) => cropBatch.greenhouse)
  crop_batches: CropBatch[];
}

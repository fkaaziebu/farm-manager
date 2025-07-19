import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AquacultureSystem } from "./aquaculture-system.entity";
import { AquacultureBatch } from "./aquaculture-batch.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity("ponds")
export class Pond {
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

  @ManyToOne(() => Farm, (farm) => farm.ponds)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.pond)
  expense_records: ExpenseRecord[];

  @Column({ default: 0 })
  volume_liters: number;

  @Column({ default: 0 })
  depth_meters: number;

  @Column({ default: 0 })
  surface_area_sqm: number;

  @Column({ default: null })
  liner_type: string;

  @Column({ default: null })
  water_source: string;

  @Column({ default: null, type: "json" })
  water_parameters: object;

  @ManyToOne(
    () => AquacultureSystem,
    (aquacultureSystem) => aquacultureSystem.ponds,
    { nullable: true },
  )
  aquacultureSystem: AquacultureSystem;

  @OneToMany(
    () => AquacultureBatch,
    (aquacultureBatch) => aquacultureBatch.pond,
  )
  aquaculture_batches: AquacultureBatch[];
}

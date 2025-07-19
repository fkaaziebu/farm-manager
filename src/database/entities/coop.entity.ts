import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PoultryHouse } from "./poultry-house.entity";
import { PoultryBatch } from "./poultry-batch.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity("coops")
export class Coop {
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

  @ManyToOne(() => Farm, (farm) => farm.coops)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.coop)
  expense_records: ExpenseRecord[];

  @Column({ default: 0 })
  nest_boxes: number;

  @Column({ default: 0 })
  area_sqm: number;

  @Column({ default: null })
  floor_type: string;

  @Column({ default: null })
  feeder_type: string;

  @Column({ default: null })
  waterer_type: string;

  @ManyToOne(() => PoultryHouse, (poultryHouse) => poultryHouse.coops, {
    nullable: true,
  })
  poultryHouse: PoultryHouse;

  @OneToMany(() => PoultryBatch, (poultryBatch) => poultryBatch.coop)
  poultry_batches: PoultryBatch[];
}

import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Coop } from "./coop.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity()
export class PoultryHouse {
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
  area_sqm: number;

  @Column({ default: null })
  ventilation_type: string;

  @Column({ default: false })
  climate_controlled: boolean;

  @Column({ default: null })
  lighting_program: string;

  @Column({ default: null })
  construction_date: Date;

  @OneToMany(() => Coop, (coop) => coop.poultryHouse)
  coops: Coop[];

  @ManyToOne(() => Farm, (farm) => farm.poultry_houses)
  farm: Farm;

  @OneToMany(
    () => ExpenseRecord,
    (expense_record) => expense_record.poultry_house,
  )
  expense_records: ExpenseRecord[];
}

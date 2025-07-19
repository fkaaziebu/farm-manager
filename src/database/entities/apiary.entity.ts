import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Hive } from "./hive.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity("apiaries")
export class Apiary {
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

  @ManyToOne(() => Farm, (farm) => farm.apiaries)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.apiary)
  expense_records: ExpenseRecord[];

  @Column({ default: 0 })
  area_sqm: number;

  @Column({ default: null })
  location_features: string;

  @Column({ default: null })
  sun_exposure: string;

  @Column({ default: null })
  wind_protection: string;

  @Column({ default: null, type: "json" })
  nearby_flora: object;

  @Column({ default: null })
  water_source: string;

  @Column({ default: null, type: "json" })
  gps_coordinates: object;

  @OneToMany(() => Hive, (hive) => hive.apiary)
  hives: Hive[];
}

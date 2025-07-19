import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Pond } from "./pond.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";

export enum AquacultureSystemType {
  POND = "POND",
  RACEWAY = "RACEWAY",
  RAS = "RAS", // Recirculating Aquaculture System
  CAGE = "CAGE",
  BIOFLOC = "BIOFLOC",
  AQUAPONICS = "AQUAPONICS",
}

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity("aquaculture_systems")
export class AquacultureSystem {
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

  @ManyToOne(() => Farm, (farm) => farm.aquaculture_systems)
  farm: Farm;

  @OneToMany(
    () => ExpenseRecord,
    (expense_record) => expense_record.aquaculture_system,
  )
  expense_records: ExpenseRecord[];

  @Column({
    type: "enum",
    enum: AquacultureSystemType,
    default: AquacultureSystemType.POND,
  })
  system_type: AquacultureSystemType;

  @Column({ default: 0 })
  total_water_volume: number;

  @Column({ default: null })
  filtration_method: string;

  @Column({ default: null })
  aeration_method: string;

  @Column({ default: null })
  water_source: string;

  @OneToMany(() => Pond, (pond) => pond.aquacultureSystem)
  ponds: Pond[];
}

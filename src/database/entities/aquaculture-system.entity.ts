import { Entity, Column, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { Pond } from "./pond.entity";

export enum AquacultureSystemType {
  POND = "POND",
  RACEWAY = "RACEWAY",
  RAS = "RAS", // Recirculating Aquaculture System
  CAGE = "CAGE",
  BIOFLOC = "BIOFLOC",
  AQUAPONICS = "AQUAPONICS",
}

@Entity()
export class AquacultureSystem extends HousingUnit {
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

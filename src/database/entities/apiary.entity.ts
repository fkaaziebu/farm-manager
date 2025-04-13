import { Entity, Column, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { Hive } from "./hive.entity";

@Entity()
export class Apiary extends HousingUnit {
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

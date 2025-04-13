import { Entity, Column, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { Coop } from "./coop.entity";

@Entity()
export class PoultryHouse extends HousingUnit {
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
}

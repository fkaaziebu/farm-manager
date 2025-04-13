import { Entity, Column, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { Pen } from "./pen.entity";

@Entity()
export class Barn extends HousingUnit {
  @Column({ default: 0 })
  area_sqm: number;

  @Column({ default: null })
  construction_date: Date;

  @Column({ default: null })
  building_material: string;

  @Column({ default: null })
  ventilation_type: string;

  @Column({ default: false })
  climate_controlled: boolean;

  @OneToMany(() => Pen, (pen) => pen.barn)
  pens: Pen[];
}

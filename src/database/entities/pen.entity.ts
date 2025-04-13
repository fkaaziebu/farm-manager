import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { Barn } from "./barn.entity";
import { Livestock } from "./livestock.entity";

@Entity()
export class Pen extends HousingUnit {
  @Column({ default: null })
  bedding_type: string;

  @Column({ default: 0 })
  area_sqm: number;

  @Column({ default: null })
  feeder_type: string;

  @Column({ default: null })
  waterer_type: string;

  @ManyToOne(() => Barn, (barn) => barn.pens, { nullable: true })
  barn: Barn;

  @OneToMany(() => Livestock, (livestock) => livestock.pen)
  livestock: Livestock[];
}

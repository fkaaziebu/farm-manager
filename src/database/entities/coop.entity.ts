import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { PoultryHouse } from "./poultry-house.entity";
import { PoultryBatch } from "./poultry-batch.entity";

@Entity()
export class Coop extends HousingUnit {
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

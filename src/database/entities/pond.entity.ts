import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { AquacultureSystem } from "./aquaculture-system.entity";
import { AquacultureBatch } from "./aquaculture-batch.entity";

@Entity()
export class Pond extends HousingUnit {
  @Column({ default: 0 })
  volume_liters: number;

  @Column({ default: 0 })
  depth_meters: number;

  @Column({ default: 0 })
  surface_area_sqm: number;

  @Column({ default: null })
  liner_type: string;

  @Column({ default: null })
  water_source: string;

  @Column({ default: null, type: "json" })
  water_parameters: object;

  @ManyToOne(
    () => AquacultureSystem,
    (aquacultureSystem) => aquacultureSystem.ponds,
    { nullable: true },
  )
  aquacultureSystem: AquacultureSystem;

  @OneToMany(
    () => AquacultureBatch,
    (aquacultureBatch) => aquacultureBatch.pond,
  )
  aquaculture_batches: AquacultureBatch[];
}

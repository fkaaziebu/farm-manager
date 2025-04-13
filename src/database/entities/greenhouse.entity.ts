import { Entity, Column, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { CropBatch } from "./crop-batch.entity";

@Entity()
export class Greenhouse extends HousingUnit {
  @Column({ default: 0 })
  area_sqm: number;

  @Column({ default: null })
  construction_date: Date;

  @Column({ default: null })
  covering_material: string;

  @Column({ default: null })
  temperature_control: string;

  @Column({ default: null })
  lighting_system: string;

  @Column({ default: null })
  irrigation_system: string;

  @Column({ default: false })
  climate_controlled: boolean;

  @Column({ default: null })
  ventilation_system: string;

  @OneToMany(() => CropBatch, (cropBatch) => cropBatch.greenhouse)
  crop_batches: CropBatch[];
}

import { Entity, Column, OneToMany } from "typeorm";
import { HousingUnit } from "./housing-unit.entity";
import { CropBatch } from "./crop-batch.entity";

@Entity()
export class Field extends HousingUnit {
  @Column({ default: 0 })
  area_hectares: number;

  @Column({ default: null })
  soil_type: string;

  @Column({ default: null })
  irrigation_type: string;

  @Column({ default: null })
  slope: string;

  @Column({ default: null })
  drainage: string;

  @Column({ default: null, type: "json" })
  soil_test_results: object;

  @Column({ default: null })
  previous_crop: string;

  @Column({ default: null, type: "json" })
  gps_coordinates: object;

  @OneToMany(() => CropBatch, (cropBatch) => cropBatch.field)
  crop_batches: CropBatch[];
}

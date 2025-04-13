import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Livestock } from "./livestock.entity";
import { PoultryBatch } from "./poultry-batch.entity";
import { AquacultureBatch } from "./aquaculture-batch.entity";

export enum GrowthPeriod {
  BIRTH = "BIRTH",
  FOUR_WEEKS = "4_WEEKS",
  EIGHT_WEEKS = "8_WEEKS",
  TWELVE_WEEKS = "12_WEEKS",
  SIXTEEN_WEEKS = "16_WEEKS",
  TWENTY_WEEKS = "20_WEEKS",
  ADULTHOOD = "ADULTHOOD",
  CUSTOM = "CUSTOM",
}

export enum GrowthRecordType {
  INDIVIDUAL = "INDIVIDUAL", // For individual animals like livestock
  BATCH = "BATCH", // For batches like poultry/fish
}

@Entity("growth_records")
export class GrowthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: GrowthRecordType,
    default: GrowthRecordType.INDIVIDUAL,
  })
  record_type: GrowthRecordType;

  @Column({
    type: "enum",
    enum: GrowthPeriod,
    default: GrowthPeriod.CUSTOM,
  })
  period: GrowthPeriod;

  @Column()
  record_date: Date;

  @Column({ default: 0 })
  weight: number;

  @Column({ default: null })
  height: number;

  @Column({ default: null })
  length: number;

  @Column({ default: null })
  growth_rate: number;

  @Column({ default: null })
  feed_conversion: number;

  @Column()
  notes: string;

  // Relations to different entity types
  @ManyToOne(() => Livestock, (livestock) => livestock.growth_records, {
    nullable: true,
  })
  livestock: Livestock;

  @ManyToOne(
    () => PoultryBatch,
    (poultryBatch) => poultryBatch.growth_records,
    { nullable: true },
  )
  poultry_batch: PoultryBatch;

  @ManyToOne(
    () => AquacultureBatch,
    (aquacultureBatch) => aquacultureBatch.growth_records,
    { nullable: true },
  )
  aquaculture_batch: AquacultureBatch;
}

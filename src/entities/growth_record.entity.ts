import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Animal } from "./animal.entity";

export enum GrowthPeriod {
  BIRTH = "BIRTH",
  FOUR_WEEKS = "4_WEEKS",
  EIGHT_WEEKS = "8_WEEKS",
  ADULTHOOD = "ADULTHOOD",
}

@Entity("growth_records")
export class GrowthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: GrowthPeriod,
  })
  period: GrowthPeriod;

  @Column({ default: null })
  growth_rate: number;

  @Column()
  notes: string;

  @ManyToOne(() => Animal, (animal) => animal.growth_records)
  animal: Animal;
}

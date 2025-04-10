import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { Animal } from "./animal.entity";

@Entity("breeding_records")
export class BreedingRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mating_date: Date;

  @Column()
  expected_delivery: Date;

  @Column({ default: null })
  actual_delivery: Date;

  @Column({ default: null })
  liter_size: number;

  @Column({ default: null })
  notes: string;

  @Column({
    type: "enum",
    enum: ["IN_PROGRESS", "SUCCESSFUL", "FAILED", "CANCELLED"],
    default: "IN_PROGRESS",
  })
  status?: string;

  @ManyToMany(() => Animal, (animal) => animal.breeding_records)
  animals: Animal[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Livestock } from "./livestock.entity";

export enum BreedingStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

@Entity("breeding_records")
export class BreedingRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mating_date: Date;

  @Column()
  expected_delivery: Date;

  @Column({ nullable: true })
  actual_delivery: Date;

  @Column({ nullable: true })
  litter_size: number;

  @Column({ nullable: true })
  offspring_count_male: number;

  @Column({ nullable: true })
  offspring_count_female: number;

  @Column({ default: 0 })
  cost: number;

  @Column({ default: null })
  notes: string;

  @Column({
    type: "enum",
    enum: BreedingStatus,
    default: BreedingStatus.PLANNED,
  })
  status: BreedingStatus;

  @Column({ nullable: true, type: "json" })
  breeding_method: object;

  @ManyToMany(() => Livestock, (livestock) => livestock.breeding_records)
  @JoinTable({
    name: "breeding_animals",
    joinColumn: { name: "breeding_record_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "livestock_id", referencedColumnName: "id" },
  })
  animals: Livestock[];

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

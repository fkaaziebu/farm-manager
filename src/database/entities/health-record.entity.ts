import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Livestock } from "./livestock.entity";
import { PoultryBatch } from "./poultry-batch.entity";
import { AquacultureBatch } from "./aquaculture-batch.entity";

export enum HealthRecordType {
  INDIVIDUAL = "INDIVIDUAL", // For individual animals like livestock
  BATCH = "BATCH", // For batches like poultry/fish
}

enum HealthRecordStatus {
  HEALTHY = "HEALTHY",
  SICK = "SICK",
  TREATED = "TREATED",
  RECOVERING = "RECOVERING",
  CRITICAL = "CRITICAL",
}

@Entity("health_records")
export class HealthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: HealthRecordType,
    default: HealthRecordType.INDIVIDUAL,
  })
  record_type: HealthRecordType;

  @Column({
    type: "enum",
    enum: HealthRecordStatus,
    default: HealthRecordStatus.HEALTHY,
  })
  record_status: HealthRecordStatus;

  @Column()
  record_date: Date;

  @Column()
  issue: string;

  @Column()
  symptoms: string;

  @Column()
  diagnosis: string;

  @Column()
  treatment: string;

  @Column({ nullable: true })
  medication: string;

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  vet_name: string;

  @Column()
  cost: number;

  @Column()
  notes: string;

  // For record types
  @ManyToOne(() => Livestock, (livestock) => livestock.health_records, {
    nullable: true,
  })
  livestock: Livestock;

  @ManyToOne(
    () => PoultryBatch,
    (poultryBatch) => poultryBatch.health_records,
    { nullable: true },
  )
  poultry_batch: PoultryBatch;

  @ManyToOne(
    () => AquacultureBatch,
    (aquacultureBatch) => aquacultureBatch.health_records,
    { nullable: true },
  )
  aquaculture_batch: AquacultureBatch;
}

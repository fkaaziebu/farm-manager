import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Farm } from "./farm.entity";
import { BreedingRecord } from "./breeding-record.entity";
import { GrowthRecord } from "./growth-record.entity";
import { ExpenseRecord } from "./expense-record.entity";
import { HealthRecord } from "./health-record.entity";
import { Pen } from "./pen.entity";

export enum LivestockType {
  CATTLE = "CATTLE",
  GOAT = "GOAT",
  SHEEP = "SHEEP",
  PIG = "PIG",
  OTHER = "OTHER",
}

export enum HealthStatus {
  HEALTHY = "HEALTHY",
  SICK = "SICK",
  TREATED = "TREATED",
  RECOVERING = "RECOVERING",
  CRITICAL = "CRITICAL",
}

enum LivestockGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

@Entity("livestock")
export class Livestock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  livestock_tag: string;

  @Column({
    type: "enum",
    enum: LivestockType,
    default: LivestockType.CATTLE,
  })
  livestock_type: LivestockType;

  @Column()
  breed: string;

  @Column({
    type: "enum",
    enum: LivestockGender,
  })
  gender: string;

  @Column()
  birth_date: Date;

  @Column({ default: 0 })
  weight: number;

  @Column({ default: null })
  milk_production: number;

  @Column({ default: null })
  meat_grade: string;

  @Column({
    type: "enum",
    enum: HealthStatus,
    default: HealthStatus.HEALTHY,
  })
  health_status: HealthStatus;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => Livestock, (livestock) => livestock.offspring)
  mother: Livestock;

  @ManyToOne(() => Livestock, (livestock) => livestock.offspring)
  father: Livestock;

  @OneToMany(
    () => Livestock,
    (livestock) => livestock.mother || livestock.father,
  )
  offspring: Livestock[];

  @ManyToOne(() => Farm, (farm) => farm.livestock)
  farm: Farm;

  @ManyToOne(() => Pen, (pen) => pen.livestock)
  pen: Pen;

  @ManyToMany(
    () => BreedingRecord,
    (breeding_record) => breeding_record.animals,
  )
  @JoinTable()
  breeding_records: BreedingRecord[];

  @OneToMany(() => GrowthRecord, (growth_record) => growth_record.livestock)
  growth_records: GrowthRecord[];

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.livestock)
  expense_records: ExpenseRecord[];

  @OneToMany(() => HealthRecord, (health_record) => health_record.livestock)
  health_records: HealthRecord[];

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

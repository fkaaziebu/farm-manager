import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Farm } from "./farm.entity";
import { BreedingRecord } from "./breeding_record.entity";
import { GrowthRecord } from "./growth_record.entity";
import { ExpenseRecord } from "./expense_record.entity";
import { HealthRecord } from "./health_record.entity";
import { SalesRecord } from "./sales_record.entity";
import { Room } from "./room.entity";

export enum FarmAnimalType {
  GRASSCUTTER = "GRASSCUTTER",
  CATTLE = "CATTLE",
  GOAT = "GOAT",
}

export enum HealthStatus {
  HEALTHY = "HEALTHY",
  SICK = "SICK",
  TREATED = "TREATED",
  RECOVERING = "RECOVERING",
  CRITICAL = "CRITICAL",
}

@Entity("animals")
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tag_number: string;

  @Column()
  gender: string;

  @Column()
  birth_date: Date;

  @Column({
    type: "enum",
    enum: FarmAnimalType,
    default: FarmAnimalType.GRASSCUTTER,
  })
  type: FarmAnimalType;

  @Column()
  breed: string;

  @Column({ default: 0 })
  weight: number;

  @Column({
    type: "enum",
    enum: HealthStatus,
    default: HealthStatus.HEALTHY,
  })
  health_status: HealthStatus;

  @Column({ default: true })
  available: boolean;

  @OneToMany(() => Animal, (animal) => animal.direct_children)
  direct_parents: Animal[];

  @OneToMany(() => Animal, (animal) => animal.direct_parents)
  direct_children: Animal[];

  @ManyToOne(() => Farm, (farm) => farm.animals)
  farm: Farm;

  @ManyToOne(() => Room, (room) => room.animals)
  room: Room;

  @ManyToMany(
    () => BreedingRecord,
    (breeding_record) => breeding_record.animals,
  )
  @JoinTable()
  breeding_records: BreedingRecord[];

  @OneToMany(() => GrowthRecord, (growth_record) => growth_record.animal)
  growth_records: GrowthRecord[];

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.animal)
  expense_records: ExpenseRecord[];

  @OneToMany(() => HealthRecord, (health_record) => health_record.animal)
  health_records: HealthRecord[];

  @OneToOne(() => SalesRecord, (sales_record) => sales_record.animal)
  @JoinColumn()
  sales_record: SalesRecord;

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

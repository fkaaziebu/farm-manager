import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Pen } from "./pen.entity";
import { Task } from "./task.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity("barns")
export class Barn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  unit_id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  capacity: number;

  @Column({
    type: "enum",
    enum: HousingStatus,
    default: HousingStatus.OPERATIONAL,
  })
  status: HousingStatus;

  @ManyToOne(() => Farm, (farm) => farm.barns)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.barn)
  expense_records: ExpenseRecord[];

  @Column({ default: 0 })
  area_sqm: number;

  @Column({ default: null })
  construction_date: Date;

  @Column({ default: null })
  building_material: string;

  @Column({ default: null })
  ventilation_type: string;

  @Column({ default: false })
  climate_controlled: boolean;

  @OneToMany(() => Pen, (pen) => pen.barn)
  pens: Pen[];

  @OneToMany(() => Task, (task) => task.barn)
  tasks: Task[];
}

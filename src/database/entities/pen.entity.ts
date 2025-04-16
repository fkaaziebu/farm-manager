import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Barn } from "./barn.entity";
import { Livestock } from "./livestock.entity";
import { Farm } from "./farm.entity";
import { ExpenseRecord } from "./expense-record.entity";
import { Task } from "./task.entity";

enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

@Entity()
export class Pen {
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

  @ManyToOne(() => Farm, (farm) => farm.pens)
  farm: Farm;

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.pen)
  expense_records: ExpenseRecord[];

  @Column({ default: null })
  bedding_type: string;

  @Column({ default: 0 })
  area_sqm: number;

  @Column({ default: null })
  feeder_type: string;

  @Column({ default: null })
  waterer_type: string;

  @ManyToOne(() => Barn, (barn) => barn.pens, { nullable: true })
  barn: Barn;

  @OneToMany(() => Livestock, (livestock) => livestock.pen)
  livestock: Livestock[];

  @OneToMany(() => Task, (task) => task.pen)
  tasks: Task[];
}

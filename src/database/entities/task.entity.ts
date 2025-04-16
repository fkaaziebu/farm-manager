import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Farm } from "./farm.entity";
import { Admin } from "./admin.entity";
import { Worker } from "./worker.entity";
import { Barn } from "./barn.entity";
import { Pen } from "./pen.entity";

enum TaskStatus {
  "PENDING" = "PENDING",
  "IN_PROGRESS" = "IN_PROGRESS",
  "COMPLETED" = "COMPLETED",
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  starting_date: Date;

  @Column()
  completion_date: Date;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @OneToOne(() => Admin, (admin) => admin.assigned_tasks)
  admin: Admin;

  @ManyToOne(() => Worker, (worker) => worker.assigned_tasks)
  worker: Worker;

  @ManyToOne(() => Farm, (farm) => farm.tasks)
  farm: Farm;

  @ManyToOne(() => Barn, (barn) => barn.tasks)
  barn: Barn;

  @ManyToOne(() => Pen, (pen) => pen.tasks)
  pen: Pen;
}

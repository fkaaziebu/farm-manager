import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Farm } from "./farm.entity";
import { Worker } from "./worker.entity";
import { Task } from "./task.entity";

@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: "uuid", default: null })
  @Exclude({ toPlainOnly: true })
  password_reset_code: string;

  @Column({ default: false })
  password_reseted: boolean;

  @Column({ default: null })
  password_reset_date: Date;

  @OneToMany(() => Farm, (farm) => farm.admin)
  farms: Farm[];

  @ManyToMany(() => Worker, (worker) => worker.admins)
  @JoinTable()
  workers: Worker[];

  @OneToMany(() => Task, (task) => task.admin)
  assigned_tasks: Task[];
}

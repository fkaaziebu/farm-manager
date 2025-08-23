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
import { Review } from "./review.entity";
import { Group } from "./group.entity";
import { Iam } from "./iam.entity";

@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, default: null })
  contact: string;

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

  @Column({ default: null })
  @Exclude({ toPlainOnly: true })
  otp_code: string;

  @Column({ default: null })
  otp_request_date: Date;

  @OneToMany(() => Farm, (farm) => farm.admin)
  farms: Farm[];

  @ManyToMany(() => Worker, (worker) => worker.admins)
  @JoinTable()
  workers: Worker[];

  @OneToMany(() => Task, (task) => task.admin)
  assigned_tasks: Task[];

  @OneToMany(() => Review, (review) => review.admin)
  reviews: Review[];

  @OneToMany(() => Group, (group) => group.admin)
  groups: Group[];

  @OneToMany(() => Iam, (aim_user) => aim_user.admin)
  iam_users: Iam[];
}

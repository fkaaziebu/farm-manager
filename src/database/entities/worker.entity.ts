import { Exclude } from "class-transformer";
import {
  Column,
  Entity,
  Generated,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admin } from "./admin.entity";
import { Farm } from "./farm.entity";
import { Group } from "./group.entity";
import { Report } from "./report.entity";
import { Review } from "./review.entity";
import { Task } from "./task.entity";

export enum WorkerRole {
  FARM_MANAGER = "FARM_MANAGER",
  VETERINARIAN = "VETERINARIAN",
  FEED_SPECIALIST = "FEED_SPECIALIST",
  ANIMAL_CARETAKER = "ANIMAL_CARETAKER",
  CROP_SPECIALIST = "CROP_SPECIALIST",
  MAINTENANCE = "MAINTENANCE",
  GENERAL_WORKER = "GENERAL_WORKER",
  AUDITOR = "AUDITOR",
}

@Entity("workers")
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  worker_tag: string;

  @Column()
  name: string;

  @Column({ unique: true, default: null })
  contact: string;

  @Column({
    type: "enum",
    enum: WorkerRole,
    array: true,
    default: [WorkerRole.ANIMAL_CARETAKER],
  })
  roles: WorkerRole[];

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  join_date: Date;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null, type: "json" })
  bio: object;

  @Column("text", { array: true, nullable: true })
  skills: string[];

  @Column({ default: null, type: "json" })
  achievements: object[];

  @Column({ default: null })
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

  @ManyToMany(() => Farm, (farm) => farm.workers)
  farms: Farm[];

  @ManyToMany(() => Admin, (admin) => admin.workers)
  admins: Admin[];

  @OneToMany(() => Task, (task) => task.worker)
  assigned_tasks: Task[];

  @OneToMany(() => Report, (report) => report.worker)
  reports: Report[];

  @OneToMany(() => Review, (review) => review.worker)
  reviews: Review[];

  @OneToMany(() => Review, (review) => review.assigned_worker)
  assigned_reviews: Review[];

  @ManyToMany(() => Group, (review) => review.workers)
  groups: Group[];
}

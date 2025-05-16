import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Admin } from "./admin.entity";
import { Worker } from "./worker.entity";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  rating: number;

  @ManyToOne(() => Admin, (admin) => admin.reviews)
  admin: Admin;

  @ManyToOne(() => Worker, (worker) => worker.reviews)
  worker: Worker;

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Worker } from "./worker.entity";
import { Farm } from "./farm.entity";

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Worker, (worker) => worker.reports)
  worker: Worker;

  @ManyToOne(() => Farm, (farm) => farm.reports)
  farm: Farm;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Column,
} from "typeorm";
import { Farm } from "./farm.entity";
import { Admin } from "./admin.entity";
import { Worker } from "./worker.entity";

@Entity("groups")
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Admin, (admin) => admin.groups)
  admin: Admin;

  @ManyToMany(() => Worker, (worker) => worker.groups)
  @JoinTable()
  workers: Worker[];

  @ManyToMany(() => Farm, (farm) => farm.groups)
  farms: Farm[];
}

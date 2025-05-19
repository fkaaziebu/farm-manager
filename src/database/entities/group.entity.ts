import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Column,
  OneToMany,
} from "typeorm";
import { Farm } from "./farm.entity";
import { Admin } from "./admin.entity";
import { Worker } from "./worker.entity";
import { Request } from "./request.entity";

@Entity("groups")
export class Group {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Admin, (admin) => admin.groups)
  admin: Admin;

  @ManyToMany(() => Worker, (worker) => worker.groups)
  @JoinTable()
  workers: Worker[];

  @ManyToMany(() => Farm, (farm) => farm.groups)
  @JoinTable()
  farms: Farm[];

  @OneToMany(() => Request, (request) => request.group)
  requests: Request[];
}

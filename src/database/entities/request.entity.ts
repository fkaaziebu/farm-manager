import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Farm } from "./farm.entity";
import { Worker } from "./worker.entity";
import { Group } from "./group.entity";

enum RequestStatus {
  PENDING = "PENDING",
  DECLINED = "DECLINED",
  ACCEPTED = "ACCEPTED",
}

enum RequestType {
  WORKER = "WORKER",
  FARM = "FARM",
}

@Entity("requests")
export class Request {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({
    type: "enum",
    enum: RequestType,
  })
  type: RequestType;

  @Column()
  expires_at: Date;

  @OneToOne(() => Worker)
  worker: Worker;

  @OneToOne(() => Farm)
  farm: Farm;

  @ManyToOne(() => Group, (group) => group.requests)
  group: Group;
}

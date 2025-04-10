import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Room } from "./room.entity";
import { Farm } from "./farm.entity";

export enum HouseStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
}

@Entity("houses")
export class House {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  house_number: string;

  @Column({ default: null })
  type: string;

  @Column({
    type: "enum",
    enum: HouseStatus,
    default: "OPERATIONAL",
  })
  status: HouseStatus;

  @ManyToOne(() => Farm, (farm) => farm.houses)
  farm: Farm;

  @OneToMany(() => Room, (room) => room.house)
  rooms: Room[];
}

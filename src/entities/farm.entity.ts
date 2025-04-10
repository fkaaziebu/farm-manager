import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Admin } from "./admin.entity";
import { Worker } from "./worker.entity";
import { Animal } from "./animal.entity";
import { House } from "./house.entity";

@Entity("farms")
export class Farm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: null })
  location: string;

  @Column({ default: null })
  area: string;

  @Column({ default: 100 })
  performance: number;

  @ManyToOne(() => Admin, (admin) => admin.farms)
  admin: Admin;

  @ManyToMany(() => Worker, (worker) => worker.farms)
  @JoinTable()
  workers: Worker[];

  @OneToMany(() => House, (house) => house.farm)
  houses: House[];

  @OneToMany(() => Animal, (animal) => animal.farm)
  animals: Animal[];
}

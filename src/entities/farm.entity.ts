import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Admin } from './admin.entity';
import { Worker } from './worker.entity';
import { Animal } from './animal.entity';
import { House } from './house.entity';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { House } from './house.entity';
import { Animal } from './animal.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  room_number: string;

  @ManyToOne(() => House, (house) => house.rooms)
  house: House;

  @OneToMany(() => Animal, (animal) => animal.room)
  animals: Animal[];
}

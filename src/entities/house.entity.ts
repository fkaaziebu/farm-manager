import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Room } from './room.entity';
import { Farm } from './farm.entity';

@Entity('houses')
export class House {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  house_number: string;

  @ManyToOne(() => Farm, (farm) => farm.houses)
  farm: Farm;

  @OneToMany(() => Room, (room) => room.house)
  rooms: Room[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { Animal } from './animal.entity';

@Entity('breeding-records')
export class BreedingRecord {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  mating_date: Date;

  @Column()
  expected_delivery: Date;

  @Column()
  actual_delivery?: Date;

  @Column()
  liter_size?: number;

  @Column()
  notes: string;

  @OneToOne(() => Animal, (animal) => animal.breeding_records)
  male: Animal;

  @OneToOne(() => Animal, (animal) => animal.breeding_records)
  female: Animal;

  @ManyToMany(() => Animal, (animal) => animal.breeding_records)
  animals: Animal[];
}

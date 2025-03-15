import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Animal } from './animal.entity';

@Entity('growth-records')
export class GrowthRecord {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  period: string;

  @Column()
  growth_rate?: number;

  @ManyToOne(() => Animal, (animal) => animal.growth_records)
  animal: Animal;
}

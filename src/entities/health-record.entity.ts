import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Animal } from './animal.entity';

@Entity('health-records')
export class HealthRecord {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  issue: string;

  @Column()
  symptoms: string;

  @Column()
  diagnosis: string;

  @Column()
  medication: string;

  @Column()
  vet_name: string;

  @Column()
  cost: number;

  @Column()
  notes: string;

  @ManyToOne(() => Animal, (animal) => animal.health_records)
  animal: Animal;
}

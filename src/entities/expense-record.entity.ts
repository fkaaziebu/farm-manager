import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Animal } from './animal.entity';

@Entity('expense-records')
export class ExpenseRecord {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  category: string;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column()
  notes: string;

  @ManyToOne(() => Animal, (animal) => animal.expense_records)
  animal: Animal;
}

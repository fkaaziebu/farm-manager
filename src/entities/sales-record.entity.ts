import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Animal } from './animal.entity';

@Entity('sales-records')
export class SalesRecord {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  buyer_name: string;

  @Column()
  sale_date: Date;

  @Column()
  price: number;

  @Column()
  expenses: number;

  @Column()
  profit: number;

  @Column()
  notes: string;

  @OneToOne(() => Animal, (animal) => animal.sales_record)
  animal: Animal;
}

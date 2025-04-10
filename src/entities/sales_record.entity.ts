import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Animal } from "./animal.entity";

@Entity("sales_records")
export class SalesRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyer_name: string;

  @Column()
  sale_date: Date;

  @Column()
  price_sold: number;

  @Column({ default: null })
  expenses: number;

  @Column()
  notes: string;

  @OneToOne(() => Animal, (animal) => animal.sales_record)
  animal: Animal;
}

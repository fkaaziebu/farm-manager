import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Farm } from './farm.entity';
import { BreedingRecord } from './breeding-record.entity';
import { GrowthRecord } from './growth-record.entity';
import { ExpenseRecord } from './expense-record.entity';
import { HealthRecord } from './health-record.entity';
import { SalesRecord } from './sales-record.entity';
import { Room } from './room.entity';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  tag_number: string;

  @Column()
  gender: string;

  @Column()
  birth_date: Date;

  @Column()
  breed: string;

  @Column({ default: 0 })
  weight?: number;

  @Column({ default: 'HEALTHY' })
  health_status?: string;

  @Column({ default: true })
  available: boolean;

  @OneToMany(() => Animal, (animal) => animal.direct_children)
  direct_parents?: Animal[];

  @OneToMany(() => Animal, (animal) => animal.direct_parents)
  direct_children?: Animal[];

  @ManyToOne(() => Farm, (farm) => farm.animals)
  farm: Farm;

  @ManyToOne(() => Room, (room) => room.animals)
  room: Room;

  @ManyToMany(
    () => BreedingRecord,
    (breeding_record) => breeding_record.animals,
  )
  @JoinTable()
  breeding_records: BreedingRecord[];

  @OneToMany(() => GrowthRecord, (growth_record) => growth_record.animal)
  growth_records: GrowthRecord[];

  @OneToMany(() => ExpenseRecord, (expense_record) => expense_record.animal)
  expense_records: ExpenseRecord[];

  @OneToMany(() => HealthRecord, (health_record) => health_record.animal)
  health_records: HealthRecord[];

  @OneToOne(() => SalesRecord, (sales_record) => sales_record.animal)
  sales_record: SalesRecord;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Farm } from './farm.entity';
import { Admin } from './admin.entity';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'uuid', default: null })
  @Exclude({ toPlainOnly: true })
  password_reset_code: string;

  @Column({ default: false })
  password_reseted: boolean;

  @Column({ default: null })
  password_reset_date: Date;

  @ManyToMany(() => Farm, (farm) => farm.workers)
  farms: Farm[];

  @ManyToOne(() => Admin, (admin) => admin.workers)
  admin: Admin;
}

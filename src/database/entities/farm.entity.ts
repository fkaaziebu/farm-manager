import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  Generated,
} from "typeorm";
import { Admin } from "./admin.entity";
import { Worker } from "./worker.entity";
import { Livestock } from "./livestock.entity";
import { PoultryBatch } from "./poultry-batch.entity";
import { AquacultureBatch } from "./aquaculture-batch.entity";
import { CropBatch } from "./crop-batch.entity";
import { Hive } from "./hive.entity";
import { Task } from "./task.entity";
import { Barn } from "./barn.entity";
import { AquacultureSystem } from "./aquaculture-system.entity";
import { Pond } from "./pond.entity";
import { Field } from "./field.entity";
import { Greenhouse } from "./greenhouse.entity";
import { Apiary } from "./apiary.entity";
import { PoultryHouse } from "./poultry-house.entity";
import { Coop } from "./coop.entity";
import { Pen } from "./pen.entity";
import { Report } from "./report.entity";
import { Group } from "./group.entity";

export enum FarmType {
  LIVESTOCK = "LIVESTOCK",
  POULTRY = "POULTRY",
  AQUACULTURE = "AQUACULTURE",
  CROP = "CROP",
  APIARY = "APIARY",
  MIXED = "MIXED",
}

@Entity("farms")
export class Farm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  @Generated("uuid")
  farm_tag: string;

  @Column()
  name: string;

  // settings props
  @Column({ default: null })
  default_start_tag: string;

  @Column({
    type: "enum",
    enum: FarmType,
    default: FarmType.MIXED,
  })
  farm_type: FarmType;

  @Column({ default: null })
  location: string;

  @Column({ type: "float", default: 0.0 })
  latitude: number;

  @Column({ type: "float", default: 0.0 })
  longitude: number;

  @Column({ type: "uuid" })
  @Generated("uuid")
  verification_code: string;

  @Column({ default: null })
  area: string;

  @Column({ default: 100 })
  performance: number;

  @ManyToOne(() => Admin, (admin) => admin.farms)
  admin: Admin;

  @ManyToMany(() => Worker, (worker) => worker.farms)
  @JoinTable()
  workers: Worker[];

  @OneToMany(() => Barn, (barn) => barn.farm)
  barns: Barn[];

  @OneToMany(
    () => AquacultureSystem,
    (aquaculture_system) => aquaculture_system.farm,
  )
  aquaculture_systems: AquacultureSystem[];

  @OneToMany(() => Pond, (pond) => pond.farm)
  ponds: Pond[];

  @OneToMany(() => Field, (field) => field.farm)
  fields: Field[];

  @OneToMany(() => Greenhouse, (greenhouse) => greenhouse.farm)
  greenhouses: Greenhouse[];

  @OneToMany(() => Apiary, (apiary) => apiary.farm)
  apiaries: Apiary[];

  @OneToMany(() => PoultryHouse, (poultry_house) => poultry_house.farm)
  poultry_houses: PoultryHouse[];

  @OneToMany(() => Coop, (coops) => coops.farm)
  coops: Coop[];

  @OneToMany(() => Pen, (pen) => pen.farm)
  pens: Pen[];

  // Animal entities by type
  @OneToMany(() => Livestock, (livestock) => livestock.farm)
  livestock: Livestock[];

  @OneToMany(() => PoultryBatch, (poultryBatch) => poultryBatch.farm)
  poultry_batches: PoultryBatch[];

  @OneToMany(
    () => AquacultureBatch,
    (aquacultureBatch) => aquacultureBatch.farm,
  )
  aquaculture_batches: AquacultureBatch[];

  // Plant entities
  @OneToMany(() => CropBatch, (cropBatch) => cropBatch.farm)
  crop_batches: CropBatch[];

  // Apiary entities
  @OneToMany(() => Hive, (hive) => hive.farm)
  hives: Hive[];

  @OneToMany(() => Task, (task) => task.admin)
  tasks: Task[];

  @OneToMany(() => Report, (report) => report.farm)
  reports: Report[];

  @ManyToMany(() => Group, (report) => report.farms)
  groups: Group[];
}

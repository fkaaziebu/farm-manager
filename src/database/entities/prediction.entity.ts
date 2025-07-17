import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Farm } from "./farm.entity";
import { Feedback } from "./feedback.entity";
import { LeafDetection } from "./leaf-detection.entity";

enum PredictionCropType {
  MAIZE = "MAIZE",
  CASSAVA = "CASSAVA",
  CASHEW = "CASHEW",
  TOMATO = "TOMATO",
}

enum ModelType {
  ENHANCED_MOBILENETV2 = "ENHANCED_MOBILENETV2",
  ENHANCED_RESNET50 = "ENHANCED_RESNET50",
}

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: PredictionCropType })
  crop_type: PredictionCropType;

  @Column({ type: "enum", enum: ModelType })
  model_used: ModelType;

  @Column()
  image_path: string;

  @Column({ type: "float" })
  processing_time_ms: number;

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Feedback, (feedback) => feedback.prediction)
  @JoinColumn()
  feedback: Feedback;

  @OneToMany(() => LeafDetection, (leaf_detection) => leaf_detection.prediction)
  leaf_detections: LeafDetection[];

  @ManyToOne(() => Farm, (farm) => farm.predictions)
  farm: Farm;
}

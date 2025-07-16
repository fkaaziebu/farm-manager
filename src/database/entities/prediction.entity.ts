import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Farm } from "./farm.entity";
import { Feedback } from "./feedback.entity";

enum PredictionCropType {
  MAIZE = "MAIZE",
  CASSAVA = "CASSAVA",
}

enum ModelType {
  MODEL_1 = "MODEL_1",
  MODEL_2 = "MODEL_2",
}

enum DiseaseType {
  DISEASE_1 = "DISEASE_1",
  DISEASE_2 = "DISEASE_2",
}

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: PredictionCropType })
  crop_type: PredictionCropType;

  @Column({ type: "enum", enum: ModelType })
  model_used: ModelType;

  @Column({ type: "enum", enum: DiseaseType })
  predicted_disease: DiseaseType;

  @Column()
  confidence: number;

  @Column({ type: "enum", enum: DiseaseType })
  top3_predictions: DiseaseType[];

  @Column()
  image_path: string;

  @Column()
  processing_time_ms: number;

  @CreateDateColumn()
  inserted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Feedback, (feedback) => feedback.prediction)
  @JoinColumn()
  feedback: Feedback;

  @ManyToOne(() => Farm, (farm) => farm.predictions)
  farm: Farm;
}

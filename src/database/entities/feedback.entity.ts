import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Prediction } from "./prediction.entity";

enum DiseaseType {
  ANTHRACNOSE = "ANTHRACNOSE",
  GUMOSIS = "GUMOSIS",
  HEALTHY = "HEALTHY",
  LEAF_MINER = "LEAF_MINER",
  RED_RUST = "RED_RUST",
  BACTERIAL_BLIGHT = "BACTERIAL_BLIGHT",
  BROWN_SPOT = "BROWN_SPOT",
  GREEN_MITE = "GREEN_MITE",
  MOSAIC = "MOSAIC",
  FALL_ARMYWORM = "FALL_ARMYWORM",
  GRASSHOPPER = "GRASSHOPPER",
  LEAF_BEETLE = "LEAF_BEETLE",
  LEAF_BLIGHT = "LEAF_BLIGHT",
  LEAF_SPOT = "LEAF_SPOT",
  STREAK_VIRUS = "STREAK_VIRUS",
  LEAF_CURL = "LEAF_CURL",
  SEPTORIA_LEAF_SPOT = "SEPTORIA_LEAF_SPOT",
  VERTICILLIUM_WILT = "VERTICILLIUM_WILT",
}

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: DiseaseType,
  })
  actual_disease: DiseaseType;

  @Column({ default: null })
  user_feedback: string;

  @OneToOne(() => Prediction, (prediction) => prediction.feedback)
  prediction: Prediction;
}

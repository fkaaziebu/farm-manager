import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  GRASSHOPER = "GRASSHOPER",
  LEAF_BEETLE = "LEAF_BEETLE",
  LEAF_BLIGHT = "LEAF_BLIGHT",
  LEAF_SPOT = "LEAF_SPOT",
  STREAK_VIRUS = "STREAK_VIRUS",
  LEAF_CURL = "LEAF_CURL",
  SEPTORIA_LEAF_SPOT = "SEPTORIA_LEAF_SPOT",
  VERTICILLIUM_WILT = "VERTICILLIUM_WILT",
}

@Entity("leaf_detections")
export class LeafDetection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null, type: "json" })
  bbox: object;

  // Fix: Add explicit type for decimal values
  @Column({ type: "float", default: 0 })
  detection_confidence: number;

  @Column({ default: null, type: "enum", enum: DiseaseType })
  predicted_disease: DiseaseType;

  // Fix: Add explicit type for decimal values
  @Column({ type: "float", default: 0 })
  confidence: number;

  @Column({ default: null, type: "json" })
  top3_predictions: object;

  @ManyToOne(() => Prediction, (prediction) => prediction.leaf_detections)
  prediction: Prediction;
}

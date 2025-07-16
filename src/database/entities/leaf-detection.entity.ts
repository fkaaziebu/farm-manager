import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prediction } from "./prediction.entity";

enum DiseaseType {
  DISEASE_1 = "DISEASE_1",
  DISEASE_2 = "DISEASE_2",
}

@Entity()
export class LeafDetection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  detection_confidence: number;

  @Column({ type: "enum", enum: DiseaseType })
  predicted_disease: DiseaseType;

  @Column()
  confidence: number;

  @Column({ type: "enum", enum: DiseaseType })
  top3_predictions: DiseaseType[];

  @ManyToOne(() => Prediction, (prediction) => prediction.leaf_detections)
  prediction: Prediction;
}

import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Prediction } from "./prediction.entity";

enum DiseaseType {
  DISEASE_1 = "DISEASE_1",
  DISEASE_2 = "DISEASE_2",
}

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: DiseaseType,
    default: DiseaseType.DISEASE_1,
  })
  actual_disease: DiseaseType;

  @Column({ default: null })
  user_feedback: string;

  @OneToOne(() => Prediction, (prediction) => prediction.feedback)
  prediction: Prediction;
}

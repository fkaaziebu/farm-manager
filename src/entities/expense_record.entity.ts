import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Animal } from "./animal.entity";

// Gender type
export enum ExpenseCategory {
  FEED = "FEED", // Individual feed costs
  MEDICAL = "MEDICAL", // Medications, treatments, individual vet care
  VACCINATION = "VACCINATION", // Routine or special vaccinations
  BREEDING = "BREEDING", // Breeding fees, artificial insemination
  IDENTIFICATION = "IDENTIFICATION", // Tags, chips, registration fees
  GROOMING = "GROOMING", // Cleaning, shearing, hoof trimming
  SUPPLEMENTS = "SUPPLEMENTS", // Vitamins, minerals, special nutrition
  TESTING = "TESTING", // Disease testing, genetic testing
  QUARANTINE = "QUARANTINE", // Isolation expenses
  TRANSPORT = "TRANSPORT", // Moving an individual animal
  SPECIAL_HOUSING = "SPECIAL_HOUSING", // Individual pens or special accommodations
  OTHER = "OTHER", // Miscellaneous individual expenses
}

@Entity("expense_records")
export class ExpenseRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ExpenseCategory,
    default: ExpenseCategory.FEED,
  })
  category: ExpenseCategory;

  @Column()
  expense_date: Date;

  @Column()
  amount: number;

  @Column()
  notes: string;

  @ManyToOne(() => Animal, (animal) => animal.expense_records)
  animal: Animal;
}

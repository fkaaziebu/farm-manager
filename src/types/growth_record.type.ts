import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { AnimalType } from "./animal.type";
import { GrowthPeriod } from "src/entities/growth_record.entity";

registerEnumType(GrowthPeriod, {
  name: "GrowthPeriod",
});

@ObjectType("GrowthRecord")
export class GrowthRecordType {
  @Field(() => ID)
  id: number;

  @Field(() => GrowthPeriod)
  period: GrowthPeriod;

  @Field({ nullable: true })
  growth_rate?: number;

  @Field()
  notes: string;

  @Field(() => AnimalType, { nullable: true })
  animal?: AnimalType;
}

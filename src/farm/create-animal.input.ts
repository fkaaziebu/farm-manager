import { Field, InputType, registerEnumType } from "@nestjs/graphql";

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

registerEnumType(Gender, {
  name: "Gender",
});

@InputType()
export class CreateAnimalInput {
  @Field()
  tag_number: string;

  @Field()
  birth_date: Date;

  @Field()
  breed: string;

  @Field(() => Gender, { nullable: false })
  gender: Gender;
}

import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType("Image")
export class ImageType {
  @Field(() => ID)
  id: string;

  @Field()
  path: string;

  @Field()
  original_name: string;

  @Field()
  mime_type: string;

  @Field(() => String, { nullable: true })
  buffer: string | null; // Base64 encoded string
}

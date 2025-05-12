import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class QrCodeResponse {
  @Field()
  qrCode: string;
}

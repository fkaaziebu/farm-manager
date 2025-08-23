import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { GraphQLJSON } from "graphql-type-json";
import { configValidationSchema } from "./config.schema";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { FarmModule } from "./modules/farm/farm.module";
import { ImageModule } from "./modules/image/image.module";
import { LlmModule } from "./modules/llm/llm.module";
import { PredictionModule } from "./modules/prediction/prediction.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [
        process.env.STAGE === "development"
          ? `.env.${process.env.STAGE}.local`
          : ".env",
      ],
      validationSchema: configValidationSchema,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      introspection: true,
      playground: true,
      driver: ApolloDriver,
      resolvers: { JSON: GraphQLJSON },
    }),
    DatabaseModule,
    AuthModule,
    FarmModule,
    LlmModule,
    ImageModule,
    PredictionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

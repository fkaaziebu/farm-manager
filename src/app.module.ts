import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { configValidationSchema } from "./config.schema";
import { ScheduleModule } from "@nestjs/schedule";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphQLJSON } from "graphql-type-json";
import { AuthModule } from "./modules/auth/auth.module";
import { FarmModule } from "./modules/farm/farm.module";
import { WorkerModule } from "./modules/worker/worker.module";
import { LlmModule } from "./modules/llm/llm.module";

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
    WorkerModule,
    LlmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configValidationSchema } from "./config.schema";
import { AuthModule } from "./auth/auth.module";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleModule } from "@nestjs/schedule";
import { FarmModule } from "./farm/farm.module";

@Module({
  imports: [
    AuthModule,
    FarmModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot({
      envFilePath: [
        process.env.STAGE === "development"
          ? `.env.${process.env.STAGE}.local`
          : ".env",
      ],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        autoLoadEntities: true,
        synchronize: configService.get("NODE_ENV") !== "production",
        host: configService.get("DB_HOST"),
        url: configService.get("DATABASE_URL"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get("REDIS_HOST", "localhost"),
          port: configService.get("REDIS_PORT", 6379),
          password: configService.get("REDIS_PASSWORD", undefined),
          db: configService.get("REDIS_DB", 0),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

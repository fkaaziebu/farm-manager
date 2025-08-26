import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as express from "express";
import { Client } from "pg";
import { AppModule } from "./app.module";

async function createDatabase(dbName: string) {
  const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database ${dbName} created successfully`);
  } catch (error) {
    if (error.code === "42P04") {
      console.log(`Database ${dbName} already exists`);
    } else {
      console.error(`Error creating database ${dbName}:`, error);
    }
  } finally {
    await client.end();
  }
}

async function bootstrap() {
  console.log("All envs");
  console.log(process.env);
  // Create main database
  await createDatabase(process.env.DB_NAME);

  // Create test database
  await createDatabase(process.env.DB_NAME_TEST);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const port = configService.get<number>("APP_PORT") || 4000;

  app.enableCors({
    origin: configService.get<string>("CORS_ORIGIN") || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.use(express.json({ limit: "20mb" })); // For JSON payloads
  app.use(express.urlencoded({ limit: "20mb", extended: true })); // For form data

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

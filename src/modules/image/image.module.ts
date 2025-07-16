import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "src/database/entities";
import { ImageController } from "./image.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Image])],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}

import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { ImageService } from "./image.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("v1")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/images/upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.uploadImage({ file });
  }

  @Get("/images/:imageId")
  async fetchImage(@Param("imageId") imageId: string, @Res() res: Response) {
    const image = await this.imageService.fetchImage({ id: imageId });

    res.setHeader("Content-Type", image.mime_type);
    res.send(image.buffer);
  }
}

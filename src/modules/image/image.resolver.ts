import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Roles } from "./decorators/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageType } from "src/database/types";
import { ImageService } from "./image.service";

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  // Mutations
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => ImageType)
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log("FILE_PAYLOAD:", file);
    return this.imageService.uploadImage({ file });
  }

  // Queries
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => ImageType)
  fetchImage(@Args("id") id: string) {
    return this.imageService.fetchImage({ id });
  }
}

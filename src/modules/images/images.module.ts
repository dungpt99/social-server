import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageRepository } from "./repositories/image.repository";
import { ImagesService } from "./services/images.services";

@Module({
  imports: [TypeOrmModule.forFeature([ImageRepository])],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}

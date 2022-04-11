import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterConfigService } from "src/config/multer/multer";
import { ImagesModule } from "../images/images.module";
import { RelationModule } from "../relation/relation.module";
import { UserModule } from "../user/user.module";
import { PostController } from "./controllers/post.controller";
import { PostRepository } from "./repositories/post.repository";
import { PostService } from "./services/post.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    UserModule,
    RelationModule,
    ImagesModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}

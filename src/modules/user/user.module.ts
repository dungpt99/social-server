import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesModule } from "../images/images.module";
import { UserController } from "./controllers/user.controller";
import { UsersRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), ImagesModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

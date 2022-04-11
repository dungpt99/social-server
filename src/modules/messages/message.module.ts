import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterConfigService } from "src/config/multer/multer";
import { ConversationModule } from "../conversations/conversation.module";
import { ImagesModule } from "../images/images.module";
import { UserModule } from "../user/user.module";
import { MessageController } from "./controllers/message.controller";
import { MessageRepository } from "./repositories/message.repository";
import { MessageService } from "./services/message.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository]),
    ConversationModule,
    UserModule,
    ImagesModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

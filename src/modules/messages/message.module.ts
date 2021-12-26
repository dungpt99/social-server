import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationModule } from '../conversations/conversation.module';
import { UserModule } from '../user/user.module';
import { MessageController } from './controllers/message.controller';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository]),
    ConversationModule,
    UserModule,
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConversationDto } from 'src/modules/conversations/dto/create-conversation.dto';
import { ConversationEntity } from 'src/modules/conversations/entities/conversation.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private readonly MessageRepository: MessageRepository,
  ) {}

  /**
   * Create
   */
  async create(
    content: string,
    conversation: ConversationEntity,
    user: UserEntity,
  ) {
    try {
      const messageModel = new MessageEntity();
      const newMessage = {
        ...messageModel,
      };
      newMessage.content = content;
      newMessage.conversation = conversation;
      newMessage.user = user;
      return await this.MessageRepository.save(newMessage);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get by receiverId
   */
  async getMany(conversationReceiverId: number): Promise<MessageEntity[]> {
    const messages = await this.MessageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.conversation', 'conversation')
      .leftJoinAndSelect('message.user', 'user')
      .where('message.conversation = :conversationReceiverId', {
        conversationReceiverId,
      })
      .getMany();
    return messages;
  }
}

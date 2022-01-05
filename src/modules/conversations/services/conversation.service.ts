import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationRepository } from '../repositories/conversation.repository';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationRepository)
    private readonly ConversationRepository: ConversationRepository,
  ) {}

  /**
   * Create
   */
  async create(senderId: UserEntity, receiverId: UserEntity): Promise<any> {
    const conversationSender = await this.getMany(senderId.id);
    const conversationReceiver = await this.getMany(receiverId.id);
    const conversationsSender = [];
    const conversationsReceiver = [];
    const conversationId = [];
    conversationSender.forEach((e) => {
      conversationsSender.push(e.id);
    });
    conversationReceiver.forEach((e) => {
      conversationsReceiver.push(e.id);
    });
    conversationsSender.forEach((id) => {
      if (conversationsReceiver.includes(id)) {
        conversationId.push(id);
      }
    });
    if (conversationId.length === 0) {
      try {
        const conversationModel = new ConversationEntity();
        const newConversation = {
          ...conversationModel,
        };
        newConversation.users = [senderId, receiverId];
        return await this.ConversationRepository.save(newConversation);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    } else {
      return this.getUser(conversationId[0]);
    }
  }
  /**
   * Get all conversation from user
   */
  async getMany(userId: number): Promise<ConversationEntity[]> {
    const conversations = await this.ConversationRepository.createQueryBuilder(
      'conversation',
    )
      .leftJoinAndSelect('conversation.users', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();
    return conversations;
  }

  /**
   * Get by user
   */
  async getUser(conversationId: number): Promise<any> {
    const conversations = await this.ConversationRepository.find({
      relations: ['users'],
      where: { id: conversationId },
    });
    return conversations;
  }

  /**
   * Get
   */
  async findOne(conversationId: number): Promise<ConversationEntity> {
    const conversation = await this.ConversationRepository.findOne({
      where: { id: conversationId },
    });
    return conversation;
  }
}

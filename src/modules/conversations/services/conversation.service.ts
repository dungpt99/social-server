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
    const conversation = await this.ConversationRepository.createQueryBuilder(
      'conversation',
    )
      .leftJoinAndSelect('conversation.users', 'user')
      .where('user.id =:id', { id: senderId.id })
      .andWhere('user.id =:id', { id: receiverId.id })
      .getMany();
    if (conversation.length === 0) {
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
    }
    return conversation;
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
  async findOne(
    receiverId: number,
    userId: number,
  ): Promise<ConversationEntity> {
    const conversation = await this.ConversationRepository.createQueryBuilder(
      'conversation',
    )
      .leftJoinAndSelect('conversation.users', 'user')
      .where('user.id =:id', { id: userId })
      .andWhere('user.id =:id', { id: receiverId })
      .getOne();
    return conversation;
  }
}

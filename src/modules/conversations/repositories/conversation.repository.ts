import { EntityRepository, Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends Repository<ConversationEntity> {}

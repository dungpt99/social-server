import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CreateRelationDto } from '../dto/create-relation.dto';
import { RelationEntity } from '../entities/relation.entity';
import { RelationRepository } from '../repositories/relation.repository';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(RelationRepository)
    private readonly RelationRepository: RelationRepository,
  ) {}

  /**
   * Create
   */
  async follow(
    CreateRelationDto: CreateRelationDto,
    user: UserEntity,
  ): Promise<RelationEntity> {
    try {
      const relationModel = new RelationEntity();
      const newRelation = {
        ...relationModel,
        ...CreateRelationDto,
      };
      newRelation.user = user;
      return await this.RelationRepository.save(newRelation);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Delete
   */
  async unfollow(id: number): Promise<string> {
    await this.RelationRepository.delete(id);
    return 'Success';
  }

  /**
   * Get friend
   */
  async getFriend(userId: number): Promise<RelationEntity[]> {
    const friend = await this.RelationRepository.createQueryBuilder('relation')
      .where('relation.user = :userId', { userId })
      .leftJoinAndSelect('relation.user', 'user')
      .getMany();
    return friend;
  }
}

import { EntityRepository, Repository } from 'typeorm';
import { RelationEntity } from '../entities/relation.entity';

@EntityRepository(RelationEntity)
export class RelationRepository extends Repository<RelationEntity> {}

import { EntityRepository, Repository } from 'typeorm';
import { TokenEntity } from '../entities/auth.entity';

@EntityRepository(TokenEntity)
export class AuthRepository extends Repository<TokenEntity> {}

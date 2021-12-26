import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationController } from './controllers/relation.controller';
import { RelationRepository } from './repositories/relation.repository';
import { RelationService } from './services/relation.service';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    forwardRef(() => PostModule),
    UserModule,
    TypeOrmModule.forFeature([RelationRepository]),
  ],
  providers: [RelationService],
  controllers: [RelationController],
  exports: [RelationService],
})
export class RelationModule {}

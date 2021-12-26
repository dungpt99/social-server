import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { LikeController } from './controllers/like.controller';
import { LikeRepository } from './repositories/like.repository';
import { LikeService } from './services/like.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikeRepository]), UserModule, PostModule],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}

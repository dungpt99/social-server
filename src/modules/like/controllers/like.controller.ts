import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { PostService } from 'src/modules/post/services/post.service';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateLikeDto } from '../dto/create.dto';
import { LikeEntity } from '../entities/like.entity';
import { LikeService } from '../services/like.service';

@Controller('/like')
export class LikeController {
  constructor(
    private readonly LikeService: LikeService,
    private readonly UserService: UserService,
    private readonly PostService: PostService,
  ) {}

  @Get('/current/:postId')
  async currentLike(@Request() Req): Promise<LikeEntity> {
    const user = await this.UserService.getById(Req.user.userId);
    return this.LikeService.findOne(user.id, Req.params.postId);
  }

  @Get(':id')
  async totalLike(@Request() Req): Promise<any> {
    return this.LikeService.totalLike(Req.params.id);
  }

  @Post()
  async like(
    @Body() CreateLikeDto: CreateLikeDto,
    @Request() Req,
  ): Promise<LikeEntity> {
    const user = await this.UserService.getById(Req.user.userId);
    const post = await this.PostService.getById(CreateLikeDto.postId);
    return this.LikeService.like(post, user);
  }

  @Delete()
  async disLike(
    @Request() Req,
    @Body() CreateLikeDto: CreateLikeDto,
  ): Promise<any> {
    const user = await this.UserService.getById(Req.user.userId);
    return this.LikeService.dislike(user.id, CreateLikeDto.postId);
  }
}

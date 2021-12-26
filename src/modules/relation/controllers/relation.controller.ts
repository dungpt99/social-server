import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { PostService } from 'src/modules/post/services/post.service';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateRelationDto } from '../dto/create-relation.dto';
import { RelationEntity } from '../entities/relation.entity';
import { RelationService } from '../services/relation.service';

@Controller('/friend')
export class RelationController {
  constructor(
    private readonly RelationService: RelationService,
    private readonly UserSevice: UserService,
    private readonly PostService: PostService,
  ) {}

  @Get('')
  async friend(@Request() Req): Promise<any> {
    const friend = await this.RelationService.getFriend(Req.user.userId);
    const listFriend = await Promise.all(
      friend.map((e) => {
        return this.UserSevice.getById(e.follow);
      }),
    );
    return listFriend;
  }

  @Post('/')
  async follow(
    @Body() CreateRelationDto: CreateRelationDto,
    @Request() Req,
  ): Promise<RelationEntity> {
    const currentUser = await this.UserSevice.getById(Req.user.userId);
    const following = await this.UserSevice.getById(CreateRelationDto.follow);

    if (following !== undefined) {
      if (currentUser.id !== CreateRelationDto.follow) {
        return this.RelationService.follow(CreateRelationDto, currentUser);
      }
    }
  }

  @Delete('/')
  async unfollow(@Request() Req): Promise<any> {
    return this.RelationService.unfollow(Req.body.follow);
  }
}

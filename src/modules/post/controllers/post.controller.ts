import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/modules/Auth/enableAuthPublic';
import { UserService } from 'src/modules/user/services/user.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { diskStorage } from 'multer';
import { RelationService } from 'src/modules/relation/services/relation.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly PostService: PostService,
    private readonly UserService: UserService,
    private readonly RelationService: RelationService,
  ) {}

  @Post('/uploads')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() Req,
    @Body() CreatePostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const imgDest = file.path.substr(6);
    console.log(file);
    console.log(CreatePostDto);
    const user = await this.UserService.find(Req.user);
    const post = await this.PostService.createWithFile(
      CreatePostDto,
      user,
      imgDest,
    );
    return post;
  }

  @Post()
  async create(
    @Body() CreatePostDto: CreatePostDto,
    @Request() Req,
  ): Promise<PostEntity> {
    console.log(Req.user);
    const user = await this.UserService.find(Req.user);
    const post = await this.PostService.create(CreatePostDto, user);
    return post;
  }

  @Get()
  async getAll(): Promise<PostEntity[]> {
    return this.PostService.getPosts();
  }

  @Get('/profile/:id')
  async getByUser(@Param('id') id: number): Promise<PostEntity[]> {
    return this.PostService.getByUser(id);
  }

  @Get('/timeline')
  async getTimeline(@Request() Req): Promise<any> {
    const friend = await this.RelationService.getFriend(Req.user.userId);
    const x = [];
    const friendPost = await Promise.all(
      friend.map((friend) => {
        return this.PostService.getByUser(friend.follow);
      }),
    );
    const userPost = await this.PostService.getByUser(Req.user.userId);
    userPost.forEach((e) => {
      x.push(e);
    });
    friendPost.forEach((e) => {
      if (e.length !== 0) {
        e.forEach((element) => {
          x.push(element);
        });
      }
    });

    return x;
  }

  @Get(':id')
  async getById(@Param() id: number): Promise<PostEntity> {
    return this.PostService.getById(id);
  }

  @Put(':id')
  async update(
    @Body() CreatePostDto: CreatePostDto,
    @Param() id: number,
  ): Promise<string> {
    return this.PostService.update(CreatePostDto, id);
  }

  @Delete(':id')
  async delete(@Param() id: number) {
    return this.PostService.delete(id);
  }
}

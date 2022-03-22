import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
} from "@nestjs/common";
import { CreateLikeDto } from "../dto/create.dto";
import { LikeEntity } from "../entities/like.entity";
import { LikeService } from "../services/like.service";

@Controller("/like")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get("/current/:postId")
  async currentLike(
    @Request() Req,
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<LikeEntity> {
    return this.likeService.findOne(Req.user.userId, id);
  }

  @Get(":id")
  async totalLike(@Request() Req): Promise<any> {
    return this.likeService.totalLike(Req.params.id);
  }

  @Post()
  async like(
    @Body() createLikeDto: CreateLikeDto,
    @Request() Req
  ): Promise<any> {
    return this.likeService.like(createLikeDto, Req.user.userId);
  }

  @Delete()
  async disLike(
    @Request() Req,
    @Body() createLikeDto: CreateLikeDto
  ): Promise<any> {
    return this.likeService.dislike(Req.user.userId, createLikeDto.postId);
  }
}

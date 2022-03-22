import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LikeEntity } from "../entities/like.entity";
import { LikeRepository } from "../repositories/like.repository";
import { CreateLikeDto } from "../dto/create.dto";
import { UserService } from "src/modules/user/services/user.service";
import { PostService } from "src/modules/post/services/post.service";

@Injectable()
export class LikeService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(LikeRepository)
    private readonly likeRepository: LikeRepository,
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {}

  async totalLike(postId: number): Promise<LikeEntity[]> {
    return await this.likeRepository
      .createQueryBuilder("like")
      .where("like.post = :postId", { postId })
      .leftJoinAndSelect("like.post", "post")
      .getMany();
  }

  async like(
    createLikeDto: CreateLikeDto,
    userId: string
  ): Promise<LikeEntity> {
    const user = await this.userService.findById(userId);
    const post = await this.postService.findById(createLikeDto.postId);
    try {
      const likeModel = new LikeEntity();
      const newLike = {
        ...likeModel,
        post,
        user,
      };
      return await this.likeRepository.save(newLike);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async dislike(userId: string, postId: string): Promise<LikeEntity> {
    const getLike = await this.likeRepository
      .createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("like.post", "post")
      .where("like.user = :userId", { userId })
      .andWhere("like.post = :postId", { postId })
      .getOne();

    if (!getLike) {
      throw new NotFoundException();
    }

    try {
      return await this.likeRepository.remove(getLike);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async findOne(userId: string, postId: string): Promise<LikeEntity> {
    const like = await this.likeRepository
      .createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("like.post", "post")
      .where("like.user = :userId", { userId })
      .andWhere("like.post = :postId", { postId })
      .getOne();
    return like;
  }
}

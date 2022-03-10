import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "src/modules/post/entities/post.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { LikeEntity } from "../entities/like.entity";
import { LikeRepository } from "../repositories/like.repository";
import { getConnection } from "typeorm";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository)
    private readonly LikeRepository: LikeRepository
  ) {}
  /**
   * Get
   */
  async totalLike(postId: number): Promise<LikeEntity[]> {
    return await this.LikeRepository.createQueryBuilder("like")
      .where("like.post = :postId", { postId })
      .leftJoinAndSelect("like.post", "post")
      .getMany();
  }

  /**
   * Like
   */
  async like(post: PostEntity, user: UserEntity): Promise<LikeEntity> {
    try {
      const likeModel = new LikeEntity();
      likeModel.post = post;
      likeModel.user = user;
      return await this.LikeRepository.save(likeModel);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  /**
   * dislike
   */
  async dislike(userId: string, postId: number): Promise<any> {
    const like = await this.LikeRepository.createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("like.post", "post")
      .where("like.user = :userId", { userId })
      .andWhere("like.post = :postId", { postId })
      .getOne();
    await this.LikeRepository.remove(like);
    return "Success";
  }

  /**
   * dislike
   */
  async findOne(userId: string, postId: number): Promise<LikeEntity> {
    const like = await this.LikeRepository.createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("like.post", "post")
      .where("like.user = :userId", { userId })
      .andWhere("like.post = :postId", { postId })
      .getOne();
    return like;
  }
}

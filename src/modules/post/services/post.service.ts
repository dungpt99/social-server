import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { EditPostDto } from '../dto/edit-post.dto';
import { PostEntity } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly PostRepository: PostRepository,
  ) {}

  /**
   * Create
   */
  async create(Body: CreatePostDto, user: UserEntity): Promise<PostEntity> {
    try {
      const postModel = new PostEntity();
      const newPost = {
        ...postModel,
        ...Body,
      };
      newPost.user = user;
      return await this.PostRepository.save(newPost);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Create with file
   */
  async createWithFile(
    Body: CreatePostDto,
    user: UserEntity,
    imgDest: string,
  ): Promise<any> {
    try {
      const postModel = new PostEntity();
      const newPost = {
        ...postModel,
        ...Body,
        img: imgDest,
      };
      newPost.user = user;
      const post = await this.PostRepository.save(newPost);
      console.log(post.createdAt.getTime());

      return post;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get
   */
  async getPosts(): Promise<PostEntity[]> {
    return await this.PostRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .getMany();
  }

  /**
   * Get by id
   */
  async getById(id: number): Promise<PostEntity> {
    return await this.PostRepository.findOne(id);
  }

  /**
   *  Get by userId
   */
  async getByUser(userId: number): Promise<PostEntity[]> {
    const post = await this.PostRepository.createQueryBuilder('post')
      .where('post.user = :userId', { userId })
      .leftJoinAndSelect('post.user', 'user')
      .getMany();
    return post;
  }

  /**
   *  Get timeline
   */
  async getTimeline(userId: number): Promise<PostEntity[]> {
    const post = await this.PostRepository.createQueryBuilder('post')
      .where('post.user = :userId', { userId })
      .leftJoinAndSelect('post.user', 'user')
      .getMany();
    return post;
  }

  /**
   * Put
   */
  async update(Body: EditPostDto, id: number) {
    const post = await this.PostRepository.findOne(id);
    try {
      for (const [key, value] of Object.entries(Body)) {
        if (key in post) {
          post[key] = value;
        }
      }
      await this.PostRepository.save(post);
      return 'Success';
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Delete post
   */
  async delete(id: number): Promise<any> {
    return await this.PostRepository.delete(id);
  }
}

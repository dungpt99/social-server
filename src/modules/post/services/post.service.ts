import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResponsePagination } from "src/common/dto/response-pagination.dto";
import { commonDelete } from "src/common/helper/common-delete";
import { commonFilter } from "src/common/helper/common-filter";
import { CommonUpdate } from "src/common/helper/common-update";
import { ImagesService } from "src/modules/images/services/images.services";
import { RelationService } from "src/modules/relation/services/relation.service";
import { UserService } from "src/modules/user/services/user.service";
import { CreatePostDto } from "../dto/create-post.dto";
import { GetPostsDto } from "../dto/list-post.dto";
import { UpdatePostDto } from "../dto/update-post.dto";
import { PostEntity } from "../entities/post.entity";
import { PostRepository } from "../repositories/post.repository";

@Injectable()
export class PostService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly imagesService: ImagesService,
    private readonly relationsService: RelationService
  ) {}

  async create(
    createPostDto: CreatePostDto,
    imgArray: Array<any>,
    userId: string
  ): Promise<PostEntity> {
    const getPostModel = new PostEntity();
    const user = await this.userService.findById(userId);
    const newPost = {
      ...getPostModel,
      ...createPostDto,
      user,
    };
    try {
      const post = await this.postRepository.save(newPost);
      if (imgArray.length !== 0) {
        const arr = commonFilter(imgArray, post, "post");
        await this.imagesService.create(arr);
      }
      return post;
    } catch (error) {
      commonDelete(imgArray);
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(params: GetPostsDto): Promise<ResponsePagination<PostEntity>> {
    try {
      return await this.postRepository.getPosts(params);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string): Promise<PostEntity> {
    try {
      const getPost = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: ["images", "user"],
      });

      if (!getPost) {
        throw new NotFoundException();
      }

      return getPost;
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async getTimeline(userId: string): Promise<PostEntity[]> {
    const listFriend = await this.relationsService.getFriend(userId);
    const arrId = listFriend.map((e) => {
      return e.id;
    });
    arrId.push(userId);
    const post = await this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .where("post.user In (:...userId)", {
        userId: arrId,
      })
      .orderBy("post.createdAt", "DESC")
      .getMany();
    return post;
  }

  async profile(userId: string): Promise<PostEntity[]> {
    return await this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .where("post.user = :userId", {
        userId,
      })
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }

  async update(
    id: string,
    body: UpdatePostDto,
    imgArray: Array<any>
  ): Promise<PostEntity> {
    let getPost = await this.postRepository.findOne({
      where: { id },
      relations: ["images"],
    });
    const arrId = getPost.images.map((e) => {
      return e.id;
    });
    getPost = CommonUpdate(getPost, body);
    if (!getPost) {
      commonDelete(imgArray);
      throw new NotFoundException();
    }
    if (getPost.images.length !== 0) {
      commonDelete(getPost.images);
    }
    if (arrId.length !== 0) {
      this.imagesService.deleteMany(arrId);
    }
    try {
      await this.postRepository.save(getPost);
      if (imgArray.length !== 0) {
        const arr = commonFilter(imgArray, getPost, "post");
        await this.imagesService.create(arr);
      }
      return await this.postRepository.findOne({
        where: { id },
        relations: ["images"],
      });
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<PostEntity> {
    const getPost = await this.postRepository.findOne({
      where: { id },
      relations: ["images"],
    });
    const arrId = getPost.images.map((e) => e.id);
    if (!getPost) {
      throw new NotFoundException();
    }
    if (arrId.length !== 0) {
      this.imagesService.deleteMany(arrId);
    }
    commonDelete(getPost.images);
    try {
      return await this.postRepository.remove(getPost);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }
}

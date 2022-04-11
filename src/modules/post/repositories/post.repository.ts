import { ResponsePagination } from "src/common/dto/response-pagination.dto";
import { CommonPagination } from "src/common/helper/common-pagination";
import { EntityRepository, Repository } from "typeorm";
import { GetPostsDto } from "../dto/list-post.dto";
import { PostEntity } from "../entities/post.entity";
@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async getPosts(params: GetPostsDto): Promise<ResponsePagination<PostEntity>> {
    const posts = this.createQueryBuilder("posts")
      .where("posts.status = :status", { status: true })
      .leftJoinAndSelect("posts.images", "images")
      .leftJoinAndSelect("posts.user", "user");
    if (params.search) {
      posts.andWhere("users.desc ilike :desc", {
        desc: `%${params.search}%`,
      });
    }
    return CommonPagination(params, posts);
  }
}

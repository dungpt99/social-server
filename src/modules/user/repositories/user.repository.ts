import { ResponsePagination } from "src/common/dto/response-pagination.dto";
import { CommonPagination } from "src/common/helper/common-pagination";
import { EntityRepository, Repository } from "typeorm";
import { GetUsersDto } from "../dto/list-user.dto";
import { UserEntity } from "../entities/user.entity";

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async getUsers(params: GetUsersDto): Promise<ResponsePagination<UserEntity>> {
    const users = this.createQueryBuilder("users").where(
      "users.status = :status",
      { status: true }
    );
    if (params.search) {
      users.andWhere("users.name ilike :name", {
        name: `%${params.search}%`,
      });
    }
    return CommonPagination(params, users);
  }
}

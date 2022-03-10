import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRelationDto } from "../dto/create-relation.dto";
import { RelationEntity } from "../entities/relation.entity";
import { RelationRepository } from "../repositories/relation.repository";
import { UserService } from "../../user/services/user.service";

@Injectable()
export class RelationService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(RelationRepository)
    private readonly relationRepository: RelationRepository,
    private readonly userService: UserService
  ) {}

  async follow(
    createRelationDto: CreateRelationDto,
    userId: string
  ): Promise<RelationEntity> {
    const currentUser = await this.userService.findById(userId);
    const followUser = await this.userService.findById(
      createRelationDto.follow
    );
    const getRelation = await this.relationRepository
      .createQueryBuilder("relations")
      .leftJoinAndSelect("relations.follow", "user")
      .where("relations.userId =:userId", { userId })
      .getMany();
    let arrRelation = getRelation.map((e) => {
      return e.follow.id;
    });

    if (
      !arrRelation.includes(followUser.id) &&
      currentUser.id !== followUser.id &&
      followUser.status === true
    ) {
      try {
        const relationModel = new RelationEntity();
        const newRelation = {
          ...relationModel,
          userId,
        };
        newRelation.follow = followUser;
        return await this.relationRepository.save(newRelation);
      } catch (error) {
        this.logger.log(error);
        throw new InternalServerErrorException();
      }
    }
    throw new InternalServerErrorException();
  }

  async unFollow(
    createRelationDto: CreateRelationDto
  ): Promise<RelationEntity> {
    const getRelation = await this.relationRepository
      .createQueryBuilder("relations")
      .leftJoinAndSelect("relations.follow", "user")
      .where("user.id =:followId", { followId: createRelationDto.follow })
      .getOne();
    try {
      return await this.relationRepository.remove(getRelation);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async getFriend(userId: string): Promise<any> {
    const getRelation = await this.relationRepository
      .createQueryBuilder("relations")
      .leftJoinAndSelect("relations.follow", "user")
      .where("relations.userId = :userId", { userId })
      .getMany();

    let arrRelation = getRelation.map((e) => {
      const { password, ...prop } = e.follow;
      return prop;
    });
    return arrRelation;
  }
}

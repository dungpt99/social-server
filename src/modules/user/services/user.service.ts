import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersRepository } from "../repositories/user.repository";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { GetUsersDto } from "../dto/list-user.dto";
import { ResponsePagination } from "src/common/dto/response-pagination.dto";
import { CommonUpdate } from "src/common/helper/common-update";
import { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository
  ) {}

  async create(body: CreateUserDto): Promise<UserEntity> {
    try {
      const userModel = new UserEntity();
      const newUser = {
        ...userModel,
        ...body,
      };
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newUser.password, salt);
      newUser.password = hashPassword;
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(params: GetUsersDto): Promise<ResponsePagination<UserEntity>> {
    try {
      return await this.userRepository.getUsers(params);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string): Promise<UserEntity> {
    try {
      const getUser = await this.userRepository.findOne(id);
      if (!getUser) {
        throw new NotFoundException();
      }
      return getUser;
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const getUser = await this.userRepository.findOne({ where: { email } });
      if (!getUser) {
        throw new NotFoundException();
      }
      return getUser;
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, body: UpdateUserDto): Promise<UserEntity> {
    let getUser = await this.userRepository.findOne(id);
    if (!getUser) {
      throw new NotFoundException();
    }
    getUser = CommonUpdate(getUser, body);
    try {
      await this.userRepository.save(getUser);
      return await this.userRepository.findOne(id);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number): Promise<UserEntity> {
    const getUser = await this.userRepository.findOne(id);
    getUser.status = false;
    try {
      return await this.userRepository.save(getUser);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async getPostByUser(id: number): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.posts", "post")
      .where("user.id = :id", { id: id })
      .getOne();
    return user;
  }
}

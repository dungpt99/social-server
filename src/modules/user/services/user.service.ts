import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from '../dto/edit-user.dto';
import { LoginDto } from 'src/modules/Auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly UsersRepository: UsersRepository,
  ) {}

  /**
   * Create user
   */
  async create(Body: CreateUserDto): Promise<UserEntity> {
    try {
      const userModel = new UserEntity();
      const newUser = {
        ...userModel,
        ...Body,
      };
      return await this.UsersRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get all user
   */
  async getUsers(): Promise<UserEntity[]> {
    const listUser = await this.UsersRepository.createQueryBuilder(
      'user',
    ).getMany();
    return listUser;
  }

  /**
   * Get user by id
   */
  async getById(id: number): Promise<UserEntity> {
    const user = await this.UsersRepository.findOne(id);
    return user;
  }

  /**
   * Find user
   */
  async find(Body: LoginDto): Promise<UserEntity> {
    return await this.UsersRepository.findOne({
      email: Body.email,
    });
  }

  /**
   * Find user
   */
  async findOne(email: string): Promise<UserEntity> {
    return await this.UsersRepository.findOne({ where: { email } });
  }

  /**
   *
   * Update user
   */
  async update(id: number, Body: EditUserDto): Promise<UserEntity> {
    const user = await this.UsersRepository.findOne(id);
    for (const [key, value] of Object.entries(Body)) {
      if (key in user) {
        user[key] = value;
      }
    }
    await this.UsersRepository.save(user);
    return user;
  }

  /**
   *
   * Delete user
   */
  async delete(id: number): Promise<any> {
    const result = await this.UsersRepository.delete(id);
    return result;
  }

  /**
   * Get post by user
   */
  async getPostByUser(id: number): Promise<any> {
    const user = await this.UsersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post')
      .where('user.id = :id', { id: id })
      .getOne();
    console.log(user);

    return user;
  }

  /**
   * Hash password
   */
  async hashPassword(user: UserEntity): Promise<UserEntity> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    return await this.UsersRepository.save(user);
  }
}

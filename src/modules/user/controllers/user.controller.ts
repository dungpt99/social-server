import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { EditUserDto } from '../dto/edit-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Public } from 'src/modules/Auth/enableAuthPublic';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() CreateUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userService.create(CreateUserDto);
    await this.userService.hashPassword(user);
    return user;
  }

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.userService.getUsers();
  }

  @Get('/current')
  async getPostByUser(@Request() Req): Promise<UserEntity> {
    return this.userService.find(Req.user);
  }

  @Get(':id')
  async getById(@Param() id: number): Promise<UserEntity> {
    return this.userService.getById(id);
  }

  @Put(':id')
  async update(
    @Param() id: number,
    @Body() EditUserDto: EditUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(id, EditUserDto);
  }

  @Delete(':id')
  async delete(@Param() id: number): Promise<any> {
    return this.userService.delete(id);
  }
}

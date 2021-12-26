import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TokenEntity } from '../entities/auth.entity';
import { AuthRepository } from '../repository/auth.repository';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly AuthRepository: AuthRepository,
    private readonly UserService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Create
   */
  async getToken(payload): Promise<any> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: process.env.ACCESS_TOKEN,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: process.env.REFRESH_TOKEN,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  /**
   * Delete
   */
  async delete(id: number): Promise<any> {
    const token = await this.AuthRepository.createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('token.userId =:userId', { userId: id })
      .getOne();

    const result = await this.AuthRepository.delete(token);
    return token;
  }

  /**
   * Validate user
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UserService.findOne(email);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  /**
   * Login
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const { accessToken, refreshToken } = await this.getToken(payload);
    try {
      const tokenModel = new TokenEntity();
      tokenModel.token = refreshToken;
      tokenModel.user = user;
      await this.AuthRepository.save(tokenModel);
    } catch (error) {
      throw error || new InternalServerErrorException();
    }

    return { accessToken, refreshToken };
  }

  /**
   * Refresh token
   */
  async refreshToken(userId: number, refreshToken: string) {
    const token = await this.AuthRepository.createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('token.userId =:userId', { userId })
      .getOne();

    if (token) {
      const user = await this.UserService.getById(userId);
      const payload = { email: user.email, sub: user.id };
      const { accessToken, refreshToken } = await this.getToken(payload);
      token.token = refreshToken;
      await this.AuthRepository.save(token);
      return { accessToken, refreshToken };
    }
  }
}

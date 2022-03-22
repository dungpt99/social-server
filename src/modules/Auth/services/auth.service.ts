import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TokenEntity } from "../entities/auth.entity";
import { AuthRepository } from "../repository/auth.repository";
import * as bcrypt from "bcrypt";
import { UserService } from "src/modules/user/services/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async getToken(payload): Promise<any> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: "2h",
        secret: process.env.ACCESS_TOKEN,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: "20h",
        secret: process.env.REFRESH_TOKEN,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async delete(id: string): Promise<any> {
    const token = await this.authRepository
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.user", "user")
      .where("token.userId =:userId", { userId: id })
      .getMany();

    await this.authRepository.remove(token);
    return token;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, email: user.email };
    const { accessToken, refreshToken } = await this.getToken(payload);
    try {
      const tokenModel = new TokenEntity();
      tokenModel.token = refreshToken;
      tokenModel.user = user;
      await this.authRepository.save(tokenModel);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
    return { accessToken, refreshToken, user: payload };
  }

  async refreshToken(userId: string) {
    const token = await this.authRepository
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.user", "user")
      .where("token.userId =:userId", { userId })
      .getOne();

    if (token) {
      const user = await this.userService.findById(userId);
      const payload = { email: user.email, sub: user.id };
      const { accessToken, refreshToken } = await this.getToken(payload);
      token.token = refreshToken;
      await this.authRepository.save(token);
      return { accessToken, refreshToken };
    }
  }
}

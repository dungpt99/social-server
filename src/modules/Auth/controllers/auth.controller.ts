import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthService } from '../services/auth.service';
import * as jwt from 'jsonwebtoken';
import { LocalAuthGuard } from '../local-auth.guard';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { Public } from '../enableAuthPublic';
import { AuthGuard } from '@nestjs/passport';

@Controller('/')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly UserService: UserService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.AuthService.login(req.user);
  }

  @Post('logout')
  async logout(@Request() req) {
    const user = await this.UserService.find(req.user);
    await this.AuthService.delete(user.id);
    return 'success';
  }

  @Public()
  @UseGuards(AuthGuard('rt-jwt'))
  @Post('refreshToken')
  async refreshToken(@Request() req) {
    const refreshToken = req.rawHeaders[1].split(' ')[1];
    return this.AuthService.refreshToken(req.user.userId, refreshToken);
  }
}

import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Public } from "../enableAuthPublic";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "../local-auth.guard";
import { ApiTags } from "@nestjs/swagger";

@Controller("/")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("logout")
  async logout(@Request() req) {
    await this.authService.delete(req.user.userId);
    req.logout();
    return "success";
  }

  @Public()
  @UseGuards(AuthGuard("rt-jwt"))
  @Post("refreshToken")
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.userId);
  }
}

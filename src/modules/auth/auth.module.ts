import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { AuthController } from "./controllers/auth.controller";
import { atStrategy } from "./at.strategy";
import { LocalStrategy } from "./local.strategy";
import { AuthRepository } from "./repository/auth.repository";
import { rtStrategy } from "./rt.strategy";
import { AuthService } from "./services/auth.service";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([AuthRepository]),
  ],
  providers: [AuthService, LocalStrategy, atStrategy, rtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

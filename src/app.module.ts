import { Module } from "@nestjs/common";
import { typeOrmConfig } from "./config/database/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PostModule } from "./modules/post/post.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { RelationModule } from "./modules/relation/relation.module";
import { LikeModule } from "./modules/like/like.module";
import { ConversationModule } from "./modules/conversations/conversation.module";
import { MessageModule } from "./modules/messages/message.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    PostModule,
    RelationModule,
    LikeModule,
    ConversationModule,
    MessageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

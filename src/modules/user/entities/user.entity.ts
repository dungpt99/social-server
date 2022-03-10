import { TokenEntity } from "src/modules/auth/entities/auth.entity";
import { ImageEntity } from "src/modules/images/entities/image.entity";
import { LikeEntity } from "src/modules/like/entities/like.entity";
import { MessageEntity } from "src/modules/messages/entities/message.entity";
import { PostEntity } from "src/modules/post/entities/post.entity";
import { RelationEntity } from "src/modules/relation/entities/relation.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar", length: 30 })
  name: string;

  @Column({ name: "email", type: "varchar", length: 30, unique: true })
  email: string;

  @Column({ name: "password", type: "varchar", length: 200 })
  password: string;

  // @Column({ name: "avatar", type: "varchar", length: 200, default: null })
  // avatar: string;

  // @Column({ name: "coverImage", type: "varchar", length: 200, default: null })
  // coverImage: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => ImageEntity, (img) => img.user)
  images: ImageEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[];

  @OneToMany(() => RelationEntity, (relation) => relation.follow)
  relations: RelationEntity[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  @Column({ name: "status", type: "boolean", default: true })
  status: boolean;
}

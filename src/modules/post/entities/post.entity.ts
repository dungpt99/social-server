import { LikeEntity } from "src/modules/like/entities/like.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { ImageEntity } from "../../images/entities/image.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "posts" })
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "desc", type: "varchar", length: 500, default: null })
  desc: string;

  @OneToMany(() => ImageEntity, (image) => image.post)
  images: ImageEntity[];

  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity;

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  @Column({ name: "status", type: "boolean", default: true })
  status: boolean;
}

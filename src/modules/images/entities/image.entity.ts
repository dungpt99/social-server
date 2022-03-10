import { PostEntity } from "src/modules/post/entities/post.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";

@Entity({ name: "images" })
export class ImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.images, { onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ name: "url", type: "varchar", length: 255 })
  url: string;

  @Column({ name: "type", type: "varchar", length: 255 })
  type: string;

  @ManyToOne(() => PostEntity, (post) => post.images, { onDelete: "CASCADE" })
  post: PostEntity;
}

import { PostEntity } from 'src/modules/post/entities/post.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LikeEntity {
  @ManyToOne(() => PostEntity, (post) => post.likes, { primary: true })
  @JoinColumn()
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.likes, { primary: true })
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}

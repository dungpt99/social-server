import { TokenEntity } from 'src/modules/Auth/entities/auth.entity';
import { ConversationEntity } from 'src/modules/conversations/entities/conversation.entity';
import { LikeEntity } from 'src/modules/like/entities/like.entity';
import { MessageEntity } from 'src/modules/messages/entities/message.entity';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('varchar', { length: 200, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  coverImage: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: MessageEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}

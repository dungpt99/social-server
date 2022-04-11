import { ConversationEntity } from "src/modules/conversations/entities/conversation.entity";
import { ImageEntity } from "src/modules/images/entities/image.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "messages" })
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  conversation: ConversationEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  user: UserEntity;

  @OneToMany(() => ImageEntity, (image) => image.message)
  images: ImageEntity[];

  @Column({ name: "content", type: "varchar", length: 500 })
  content: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}

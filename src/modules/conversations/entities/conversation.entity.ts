import { MessageEntity } from "src/modules/messages/entities/message.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "conversations" })
export class ConversationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}

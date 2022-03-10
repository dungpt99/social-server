import { UserEntity } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "tokens" })
export class TokenEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "token", length: 300, type: "varchar" })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user: UserEntity;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}

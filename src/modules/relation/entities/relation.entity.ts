import { UserEntity } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "relations" })
export class RelationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.relations)
  follow: UserEntity;

  @Column({ name: "userId", type: "varchar" })
  userId: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}

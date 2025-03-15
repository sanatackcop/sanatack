import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

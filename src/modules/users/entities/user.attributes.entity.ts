import AbstractEntity from '@libs/db/abstract.base.entity';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import User from './user.entity';

export enum UserType {
  student = 'student',
  professional = 'professional',
  other = 'other',
}

@Entity({ name: 'users_attributes' })
export default class UsersAttributes extends AbstractEntity {
  @Column('varchar', { array: true })
  topics: string[];

  @Column({ enum: UserType })
  userType: UserType;

  @Column('text', { nullable: true })
  bio?: string;

  @Column({ type: 'varchar', nullable: true })
  organization?: string;

  @OneToOne(() => User, (user) => user.attributes)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}

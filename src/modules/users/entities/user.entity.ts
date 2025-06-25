import AbstractEntity from '@libs/db/abstract.base.entity';
import { decrypt, encrypt } from 'src/modules/auth/helper';
import { CareerEnrollment } from 'src/modules/courses/entities/career-enrollment.entity';
import { Enrollment } from 'src/modules/courses/entities/enrollment';
import { RoadmapEnrollment } from 'src/modules/courses/entities/roadmap-enrollment.entity';
import { Entity, Column, OneToMany, Relation, OneToOne } from 'typeorm';
import UsersAttributes from './user.attributes.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export default class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({
    transformer: {
      to: (value: string) => (value ? encrypt(value) : value),
      from: (value: string) => (value ? decrypt(value) : value),
    },
  })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: 'student' })
  role: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isVerify: boolean;

  @Column({ default: false })
  isPro: boolean;

  @Column({ nullable: true })
  phone: string;

  @OneToOne(() => UsersAttributes, (attributes) => attributes.user, {
    cascade: true,
  })
  attributes: Relation<UsersAttributes>;

  @OneToMany(() => Enrollment, (user) => user.user)
  enrollment: Relation<Enrollment[]>;

  @OneToMany(() => RoadmapEnrollment, (user) => user.user)
  roadmapEnrollments: Relation<RoadmapEnrollment[]>;

  @OneToMany(() => CareerEnrollment, (user) => user.user)
  careerPathEnrollments: Relation<CareerEnrollment[]>;
}

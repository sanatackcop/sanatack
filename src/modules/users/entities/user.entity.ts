import { Token } from 'src/modules/auth/entities/token.entity';
import { decrypt, encrypt } from 'src/modules/auth/helper';
import { CareerEnrollment } from 'src/modules/courses/entities/career-enrollment.entity';
import { Enrollment } from 'src/modules/courses/entities/enrollment';
import { RoadmapEnrollment } from 'src/modules/courses/entities/roadmap-enrollment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

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

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Enrollment, (user) => user.user)
  enrollment: Enrollment[];

  @OneToMany(() => RoadmapEnrollment, (user) => user.user)
  roadmapEnrollments: RoadmapEnrollment[];

  @OneToMany(() => CareerEnrollment, (user) => user.user)
  careerpathEnrollments: CareerEnrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { CareerPath } from './career-path.entity';
import User from 'src/modules/users/entities/user.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity({ name: 'career_enrollment' })
export class CareerEnrollment extends AbstractEntity {
  @ManyToOne(
    () => CareerPath,
    (careerpath) => careerpath.careerpathEnrollments,
    {
      onDelete: 'SET NULL',
      nullable: false,
    }
  )
  @JoinColumn({ name: 'careerpath_id' })
  careerPath: Relation<CareerPath>;

  @ManyToOne(() => User, (user) => user.careerPathEnrollments, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;
}

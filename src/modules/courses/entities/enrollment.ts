import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Course } from './courses.entity';
import { User } from 'src/modules/users/entities/user.entity';
import AbstractEntity from './abstract.base.entity';

@Entity({ name: 'enrollment' })
export class Enrollment extends AbstractEntity {
  @ManyToOne(() => Course, (course) => course.enrollment, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, (user) => user.enrollment, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;
}

import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Course } from './courses.entity';
import User from 'src/modules/users/entities/user.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity({ name: 'enrollment' })
export class Enrollment extends AbstractEntity {
  @ManyToOne(() => Course, (course) => course.enrollment, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'course_id' })
  course: Relation<Course>;

  @ManyToOne(() => User, (user) => user.enrollment, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column()
  progress_counter: number;

  @Column({ nullable: true })
  current_material_id: string;

  @Column()
  is_finished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;
}

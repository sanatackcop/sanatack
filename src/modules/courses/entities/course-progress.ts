import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './courses.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('course_progress')
export class CourseProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (course) => course.courseProgress, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, (user) => user.courseProgress, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  progress: number;

  @CreateDateColumn()
  cancelledAt: Date;
}

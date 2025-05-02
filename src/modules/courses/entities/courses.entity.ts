import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Level } from '../dto';
import { CourseMapper } from './courses-maper.entity';
import { CourseProgress } from './course-progress';
import { Enrollment } from './enrollment';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text' })
  level: Level;

  @Column({ type: 'jsonb', nullable: true })
  tags?: {
    durtionsHours: number;
  };

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => CourseMapper, (mapper) => mapper.course)
  courseMappers: CourseMapper[];

  @OneToMany(() => CourseProgress, (course) => course.course)
  courseProgress: CourseProgress[];

  @OneToMany(() => Enrollment, (course) => course.course)
  enrollment: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

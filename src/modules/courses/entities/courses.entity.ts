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

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

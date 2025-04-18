import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Module } from './module.entity';
import { Course } from './courses.entity';

@Entity('course_mapper')
export class CourseMapper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (course) => course.courseMappers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Module, (module) => module.courseMappers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @Column({ type: 'int' })
  order: number;

  @CreateDateColumn()
  createdAt: Date;
}

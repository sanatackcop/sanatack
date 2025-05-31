import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Module } from './module.entity';
import { Course } from './courses.entity';
import AbstractEntity from './abstract.base.entity';

@Entity('course_mapper')
export class CourseMapper extends AbstractEntity {
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
}

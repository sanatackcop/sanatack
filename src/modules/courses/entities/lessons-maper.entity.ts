import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Module } from './module.entity';
import { Lesson } from './lessons.entity';

@Entity('lesson_mapper')
export class LessonMapper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Module, (module) => module.lessonMappers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @ManyToOne(() => Lesson, (lesson) => lesson.lessonMapper, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ type: 'int' })
  order: number;

  @CreateDateColumn()
  createdAt: Date;
}

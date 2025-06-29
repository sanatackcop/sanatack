import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CodeLesson } from './code-lesson.entity';

@Entity('test_cases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  input: string;

  @Column({ type: 'text' })
  expectedOutput: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  lessonId: string;

  @ManyToOne(() => CodeLesson, (lesson) => lesson.testCases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  lesson: CodeLesson;
}

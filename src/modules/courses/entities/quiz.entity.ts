import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lessons.entity';

@Entity({ name: 'quiz' })
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  question: string;

  @Column({ type: 'jsonb', nullable: false })
  options: string[];

  @Column({ nullable: false })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.quizzes)
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;
}

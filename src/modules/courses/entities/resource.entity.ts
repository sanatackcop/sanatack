import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lessons.entity';

@Entity({ name: 'resource' })
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  type: 'video' | 'document' | 'link' | 'code';

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.resources)
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;
}

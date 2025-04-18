import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lessons.entity';

@Entity({ name: 'video_resource' })
export class VideoResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  youtubeId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.videos)
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;
}

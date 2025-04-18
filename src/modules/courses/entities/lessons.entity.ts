import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { Resource } from './resource.entity';
import { VideoResource } from './video-lessons.entity';
import { LessonMapper } from './lessons-maper.entity';

@Entity({ name: 'lesson' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  order: number;

  @OneToMany(() => Resource, (resource) => resource.lesson)
  resources: Resource[];

  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];

  @OneToMany(() => VideoResource, (video) => video.lesson)
  videos: VideoResource[];

  @OneToMany(() => LessonMapper, (mapper) => mapper.lesson)
  lessonMapper: LessonMapper[];

  @CreateDateColumn()
  createdAt: Date;
}

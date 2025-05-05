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
import { MaterialMapper } from './material-mapper';

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

  @OneToMany(() => LessonMapper, (mapper) => mapper.lesson)
  lessonMapper: LessonMapper[];

  @OneToMany(() => MaterialMapper, (mapper) => mapper.lesson)
  materialMapper: MaterialMapper[];

  @CreateDateColumn()
  createdAt: Date;
}

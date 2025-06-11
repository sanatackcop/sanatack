import { Entity, Column, OneToMany } from 'typeorm';
import LessonMapper from './lessons-maper.entity';
import MaterialMapper from './material-mapper';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity({ name: 'lesson' })
export class Lesson extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => LessonMapper, (mapper) => mapper.lesson)
  lessonMapper: LessonMapper[];

  @OneToMany(() => MaterialMapper, (mapper) => mapper.lesson)
  materialMapper: MaterialMapper[];
}

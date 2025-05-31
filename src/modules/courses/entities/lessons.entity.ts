import { Entity, Column, OneToMany } from 'typeorm';
import { LessonMapper } from './lessons-maper.entity';
import { MaterialMapper } from './material-mapper';
import AbstractEntity from './abstract.base.entity';

@Entity({ name: 'lesson' })
export class Lesson extends AbstractEntity {
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
}

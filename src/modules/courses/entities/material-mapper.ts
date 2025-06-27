import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Lesson } from './lessons.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

export enum MaterialType {
  VIDEO = 'video',
  QUIZ_GROUP = 'quiz_group',
  QUIZ = 'quiz',
  LINK = 'link',
  ARTICLE = 'article',
}

@Entity({ name: 'material_mapper' })
@Unique('lesson_material_unique', ['lesson', 'material_id'])
export default class MaterialMapper extends AbstractEntity {
  @ManyToOne(() => Lesson, (lesson) => lesson.materialMapper, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ type: 'int', nullable: false })
  order: number;

  @Column({ type: 'uuid', nullable: false })
  material_id: string;

  @Column({ type: 'enum', enum: MaterialType, nullable: false })
  material_type: MaterialType;

  @Column()
  material_duration: number;
}

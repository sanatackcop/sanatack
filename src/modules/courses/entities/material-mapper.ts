import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Lesson } from './lessons.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

// type: "video" | "document" | "link" | "code";
export enum MaterialType {
  RESOURCE = 'resource',
  VIDEO = 'video',
  QUIZ = 'quiz',
  LINK = 'link',
}

@Entity({ name: 'material_mapper' })
@Unique('lesson_material_unique', ['lesson', 'material_id'])
export default class MaterialMapper extends AbstractEntity {
  @ManyToOne(() => Lesson, (lesson) => lesson.materialMapper, {
    onDelete: 'SET NULL',
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

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Lesson } from './lessons.entity';
import AbstractEntity from './abstract.base.entity';

export enum MaterialType {
  RESOURCE = 'resource',
  VIDEO = 'video',
  QUIZ = 'quiz',
}

@Entity({ name: 'material_mapper' })
export class MaterialMapper extends AbstractEntity {
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
}

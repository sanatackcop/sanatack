import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lessons.entity';

export enum MaterialType {
  RESOURCE = 'resource',
  VIDEO = 'video',
  QUIZ = 'quiz',
}

@Entity({ name: 'material_mapper' })
export class MaterialMapper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Lesson } from './lessons.entity';
import AbstractEntity from './abstract.base.entity';

// type: "video" | "document" | "link" | "code";
export enum MaterialType {
  RESOURCE = 'resource',
  VIDEO = 'video',
  QUIZ = 'quiz',
  LINK = 'link',
}

export declare type MaterialResource = {
  title: string;
  description: string;
  url: string;
  content: string;
  type: MaterialType.RESOURCE;
};

export declare type MaterialVideo = {
  title: string;
  youtubeId: string;
  description: string;
  duration: number;
  type: MaterialType.VIDEO;
};

export declare type MaterialQuiz = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: MaterialType.QUIZ;
};

export declare type MaterialIF =
  | MaterialResource
  | MaterialVideo
  | MaterialQuiz;

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

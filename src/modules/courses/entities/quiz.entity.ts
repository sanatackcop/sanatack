import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';
import { MaterialType } from './material-mapper';

export declare type LinkQuiz = Quiz & {
  order: number;
  type: MaterialType.QUIZ;
};

@Entity({ name: 'quiz' })
export default class Quiz extends AbstractEntity {
  @Column({ nullable: false })
  question: string;

  @Column({ type: 'jsonb', nullable: false })
  options: string[];

  @Column({ nullable: false })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column()
  duration: number;
}

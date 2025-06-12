import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';

export declare type LinkQuiz = Quiz & {
  order: number;
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
}

import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity({ name: 'quiz' })
export class Quiz extends AbstractEntity {
  @Column({ nullable: false })
  question: string;

  @Column({ type: 'jsonb', nullable: false })
  options: string[];

  @Column({ nullable: false })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;
}

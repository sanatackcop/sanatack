import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'quiz' })
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  question: string;

  @Column({ type: 'jsonb', nullable: false })
  options: string[];

  @Column({ nullable: false })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @CreateDateColumn()
  createdAt: Date;
}

import { Entity, Column, OneToMany } from 'typeorm';
import { TestCase } from './test-case.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity('code_lessons')
export class CodeLesson extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  main_title: string;

  @Column()
  duration: number;

  @Column({ type: 'json' })
  data: {
    title: string;
    description?: string;
    body: string;
    imageUrl?: string;
    videoUrl?: string;
    codeSnippet: {
      lang: string;
      code: string;
    };
  }[];

  @Column({ type: 'text', nullable: true })
  hint?: string;

  @Column({ type: 'text', nullable: true })
  initialCode?: string;

  @OneToMany(() => TestCase, (testCase) => testCase.lesson, { cascade: true })
  testCases: TestCase[];
}

import { Column, Entity, OneToMany, Relation } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';
import Quiz, { LinkQuiz } from './quiz.entity';
import { MaterialType } from './material-mapper';

export declare type QuizGroupIF = {
  id: string;
  title: string;
  quizzes: LinkQuiz[];
  order: number;
  type: MaterialType.QUIZ_GROUP;
};

@Entity({ name: 'quiz_group' })
export default class QuizGroup extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  duration: number;

  @OneToMany(() => Quiz, (quiz) => quiz.quizGroup)
  quizzes: Relation<Quiz[]>;
}

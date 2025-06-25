import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Quiz from '../entities/quiz.entity';
import { Repository, Equal, FindManyOptions, DeepPartial } from 'typeorm';

@Injectable()
export default class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>
  ) {}

  create(quiz: DeepPartial<Quiz>) {
    return this.quizRepository.save(this.quizRepository.create(quiz));
  }

  async findOne(id: string) {
    return this.quizRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  findAll(where: FindManyOptions<Quiz>) {
    return this.quizRepository.find(where);
  }

  getAll() {
    return this.quizRepository.find();
  }
}

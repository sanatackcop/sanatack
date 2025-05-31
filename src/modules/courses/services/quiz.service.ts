import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Repository, Equal } from 'typeorm';

@Injectable()
export default class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>
  ) {}

  async findOne(id: string) {
    return this.quizRepository.findOne({
      where: { id: Equal(id) },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Repository, Equal } from 'typeorm';
import { QuizDto } from '../entities/dto';

@Injectable()
export default class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>
  ) {}

  create(quiz: QuizDto) {
    return this.quizRepository.save(this.quizRepository.create(quiz));
  }

  async findOne(id: string) {
    return this.quizRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  getAll() {
    return this.quizRepository.find();
  }
}

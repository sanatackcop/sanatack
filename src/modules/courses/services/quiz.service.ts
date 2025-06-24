import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Quiz from '../entities/quiz.entity';
import { Repository, Equal, FindManyOptions } from 'typeorm';
import { QuizDto } from '../entities/dto';
import MaterialMapper, { MaterialType } from '../entities/material-mapper';

@Injectable()
export default class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(MaterialMapper)
    private readonly materialMapperRepository: Repository<MaterialMapper>
  ) {}

  create(quiz: QuizDto) {
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

  async delete(quizId: string) {
    await this.materialMapperRepository.delete({
      material_id: quizId,
      material_type: MaterialType.QUIZ,
    });
    const result = await this.quizRepository.delete(quizId);
    if (result.affected === 0) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }
  }
}

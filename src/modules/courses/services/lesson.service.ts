import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { Lesson } from '../entities/lessons.entity';

@Injectable()
export default class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>
  ) {}

  async create(module: DeepPartial<Lesson>) {
    return this.lessonRepository.save(this.lessonRepository.create(module));
  }

  async findOne(id: string) {
    return this.lessonRepository.findOne({
      where: { id: Equal(id) },
    });
  }
}

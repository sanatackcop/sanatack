import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import LessonMapper from '../entities/lessons-maper.entity';

@Injectable()
export default class LessonMapperService {
  constructor(
    @InjectRepository(LessonMapper)
    private readonly lessonMapper: Repository<LessonMapper>
  ) {}

  create(map: DeepPartial<LessonMapper>) {
    return this.lessonMapper.save(this.lessonMapper.create(map));
  }
}

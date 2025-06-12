import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
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

  getAllLinkedByLessons(module_id: string) {
    return this.lessonMapper.find({
      where: { module: { id: Equal(module_id) } },
      relations: {
        lesson: true,
      },
    });
  }
}

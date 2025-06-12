import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import LessonMapper from '../entities/lessons-maper.entity';
import MaterialMapperService from './material.mapper.service';

@Injectable()
export default class LessonMapperService {
  constructor(
    @InjectRepository(LessonMapper)
    private readonly lessonMapper: Repository<LessonMapper>,
    private readonly materialMapper: MaterialMapperService
  ) {}

  create(map: DeepPartial<LessonMapper>) {
    return this.lessonMapper.save(this.lessonMapper.create(map));
  }

  async getMaterialCount(module_id: string) {
    const linkedLessons = await this.lessonMapper.find({
      where: { module: { id: module_id } },
      relations: { lesson: true },
    });
    let sum = 0;
    for (const lesson of linkedLessons) {
      sum += await this.materialMapper.getMaterialCount(lesson.lesson.id);
    }
    return sum;
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

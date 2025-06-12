import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Like, Repository } from 'typeorm';
import { Module } from '../entities/module.entity';
import LessonMapper from '../entities/lessons-maper.entity';
import LessonService from './lesson.service';

@Injectable()
export default class ModuleService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    private readonly lessonService: LessonService
  ) {}

  async create(module: DeepPartial<Module>) {
    return this.moduleRepository.save(this.moduleRepository.create(module));
  }

  async findOne(id: string) {
    return this.moduleRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  getAll(): Promise<Module[]> {
    return this.moduleRepository.find();
  }

  async getAllModulesByTitle(module_title: string) {
    return this.moduleRepository.find({
      where: {
        title: Like(`%${module_title}%`),
      },
      relations: { lessonMappers: true },
    });
  }

  async getDetails(module: DeepPartial<Module>) {
    return {
      id: module.id,
      title: module.title,
      lessons: await Promise.all(
        module.lessonMappers?.map(
          async (lessonMapper: LessonMapper) =>
            await this.lessonService.getDetails(lessonMapper.lesson)
        ) ?? []
      ),
    };
  }
}

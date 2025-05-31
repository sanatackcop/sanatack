import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from './entities/module.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export default class ModuleService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>
  ) {}

  async getAllModulesByTitle(module_title: string) {
    console.log({ module_title });
    return this.moduleRepository.find({
      where: {
        title: Like(`%${module_title}%`),
      },
      relations: { lessonMappers: true },
    });
  }
}

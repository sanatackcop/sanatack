import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Like, Repository } from 'typeorm';
import { Module } from '../entities/module.entity';

@Injectable()
export default class ModuleService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>
  ) {}

  async create(module: DeepPartial<Module>) {
    return this.moduleRepository.save(this.moduleRepository.create(module));
  }

  async findOne(id: string) {
    return this.moduleRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  async getAllModulesByTitle(module_title: string) {
    return this.moduleRepository.find({
      where: {
        title: Like(`%${module_title}%`),
      },
      relations: { lessonMappers: true },
    });
  }
}

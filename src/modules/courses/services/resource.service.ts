import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, FindManyOptions } from 'typeorm';
import Resource from '../entities/resource.entity';
import { ResourceDto } from '../entities/dto';

@Injectable()
export default class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  create(quiz: ResourceDto) {
    return this.resourceRepository.save(this.resourceRepository.create(quiz));
  }

  async findOne(id: string) {
    return this.resourceRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  findAll(where: FindManyOptions<Resource>) {
    return this.resourceRepository.find(where);
  }

  getAll() {
    return this.resourceRepository.find();
  }
}

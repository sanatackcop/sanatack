import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Resource } from '../entities/resource.entity';
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

  getAll() {
    return this.resourceRepository.find();
  }
}

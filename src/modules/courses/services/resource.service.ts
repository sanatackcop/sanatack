import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Resource } from '../entities/resource.entity';

@Injectable()
export default class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  async findOne(id: string) {
    return this.resourceRepository.findOne({
      where: { id: Equal(id) },
    });
  }
}

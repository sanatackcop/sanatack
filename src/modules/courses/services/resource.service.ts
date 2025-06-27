import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, FindManyOptions } from 'typeorm';
import Resource from '../entities/resource.entity';
import { ResourceDto, UpdateResourceDto } from '../entities/dto';
import MaterialMapper, { MaterialType } from '../entities/material-mapper';

@Injectable()
export default class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(MaterialMapper)
    private readonly materialMapperRepository: Repository<MaterialMapper>
  ) {}

  create(resource: ResourceDto) {
    return this.resourceRepository.save(
      this.resourceRepository.create(resource)
    );
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

  async delete(resourceId: string) {
    await this.materialMapperRepository.delete({
      material_id: resourceId,
      material_type: MaterialType.ARTICLE,
    });
    const result = await this.resourceRepository.delete(resourceId);
    if (result.affected === 0) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }
  }

  async update(resourceId: string, dto: UpdateResourceDto) {
    const result = await this.resourceRepository.update(resourceId, dto);
    if (result.affected === 0) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }
    return result;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, FindManyOptions } from 'typeorm';
import Video from '../entities/video.entity';
import { VideoDto } from '../entities/dto';
import MaterialMapper, { MaterialType } from '../entities/material-mapper';

@Injectable()
export default class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(MaterialMapper)
    private readonly materialMapperRepository: Repository<MaterialMapper>
  ) {}

  create(video: VideoDto) {
    return this.videoRepository.save(this.videoRepository.create(video));
  }

  async findOne(id: string) {
    return this.videoRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  findAll(where: FindManyOptions<Video>) {
    return this.videoRepository.find(where);
  }

  getAll() {
    return this.videoRepository.find();
  }

  async delete(videoId: string) {
    const deleteMapper = await this.materialMapperRepository.delete({
      material_id: videoId,
      material_type: MaterialType.VIDEO,
    });
    if (deleteMapper.affected === 0) {
      throw new NotFoundException(
        `Material mapping for Video ID ${videoId} not found`
      );
    }
    const result = await this.videoRepository.delete(videoId);
    if (result.affected === 0) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }
  }
}

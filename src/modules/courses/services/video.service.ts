import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { VideoResource } from '../entities/video-lessons.entity';

@Injectable()
export default class VideoService {
  constructor(
    @InjectRepository(VideoResource)
    private readonly videoRepository: Repository<VideoResource>
  ) {}

  async findOne(id: string) {
    return this.videoRepository.findOne({
      where: { id: Equal(id) },
    });
  }
}

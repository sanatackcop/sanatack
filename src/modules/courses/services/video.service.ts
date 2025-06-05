import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { VideoResource } from '../entities/video-lessons.entity';
import { VideoDto } from '../entities/dto';

@Injectable()
export default class VideoService {
  constructor(
    @InjectRepository(VideoResource)
    private readonly videoRepository: Repository<VideoResource>
  ) {}

  create(quiz: VideoDto) {
    return this.videoRepository.save(this.videoRepository.create(quiz));
  }

  async findOne(id: string) {
    return this.videoRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  getAll() {
    return this.videoRepository.find();
  }
}

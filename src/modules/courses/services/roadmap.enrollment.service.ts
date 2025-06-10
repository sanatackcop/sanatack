import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { RoadmapEnrollment } from '../entities/roadmap-enrollment.entity';
import User from 'src/modules/users/entities/user.entity';
import { RoadMap } from '../entities/roadmap.entity';

@Injectable()
export default class RoadMapEnrollmentService {
  constructor(
    @InjectRepository(RoadmapEnrollment)
    private readonly roadmapEnrollmentRepository: Repository<RoadmapEnrollment>
  ) {}

  async create(user: User, roadmap: RoadMap) {
    return this.roadmapEnrollmentRepository.save(
      this.roadmapEnrollmentRepository.create({
        user,
        roadmap,
      })
    );
  }

  async findOne(id: string) {
    return this.roadmapEnrollmentRepository.findOne({
      where: { id: Equal(id) },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { RoadMap } from '../entities/roadmap.entity';
import { CareerPathContext, RoadmapDetails } from '../entities/dto';
import { CoursesService } from './courses.service';
import UsersService from 'src/modules/users/users.service';
import RoadMapEnrollmentService from './roadmap.enrollment.service';

@Injectable()
export default class RoadMapService {
  constructor(
    @InjectRepository(RoadMap)
    private readonly roadmapRepository: Repository<RoadMap>,
    private readonly courseService: CoursesService,
    private readonly userService: UsersService,
    private readonly roadmapEnrollment: RoadMapEnrollmentService
  ) {}

  async findOne(id: string) {
    return this.roadmapRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  async roadmapEnrollmentCheck(
    userId: string,
    roadmapId: string
  ): Promise<boolean> {
    const isEnrolled = await this.roadmapRepository
      .createQueryBuilder('roadmap')
      .leftJoin('roadmap.roadmapEnrollments', 'enrollment')
      .leftJoin('enrollment.user', 'user')
      .where('roadmap.id = :roadmapId', { roadmapId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return !!isEnrolled;
  }

  async roadmapDetails(id: string): Promise<RoadmapDetails> {
    const roadmap = await this.roadmapRepository
      .createQueryBuilder('roadmap')
      .leftJoinAndSelect('roadmap.roadmapMappers', 'mapper')
      .leftJoinAndSelect('mapper.course', 'course')
      .where('roadmap.id = :id', { id })
      .orderBy('mapper.order', 'DESC')
      .getOne();

    if (!roadmap) {
      throw new Error('Roadmap not found');
    }

    const courses = await Promise.all(
      roadmap.roadmapMappers.map((mapper) =>
        this.courseService.courseDetails(mapper.course.id)
      )
    );

    return {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      courses,
    };
  }

  async listRoadmaps(): Promise<CareerPathContext[]> {
    const roadmaps = await this.roadmapRepository.find({
      order: {
        created_at: 'DESC',
      },
    });

    const roadmap = roadmaps.map((roadmap) => ({
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
    }));
    return roadmap;
  }

  async roadmapDetailsUser(
    id: string,
    userId: string
  ): Promise<RoadmapDetails> {
    const roadmapDetails = await this.roadmapDetails(id);
    const isEnrolled = await this.roadmapEnrollmentCheck(userId, id);
    return {
      ...roadmapDetails,
      isEnrolled: isEnrolled,
    };
  }

  async enrollingRoadmap(userId: string, roadmapId: string) {
    const roadmap = await this.findOne(roadmapId);

    if (!roadmap) {
      throw new Error('Roadmap not found');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const isEnrolled = await this.roadmapEnrollmentCheck(userId, roadmapId);

    if (isEnrolled) {
      throw new Error('User is already enrolled in this roadmap');
    }
    return await this.roadmapEnrollment.create(user, roadmap);
  }
}

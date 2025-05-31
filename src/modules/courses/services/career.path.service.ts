import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { CareerPath } from '../entities/career-path.entity';
import { CareerPathContext, CareerPathDetails } from '../entities/dto';
import RoadMapService from './roadmap.service';
import CareerEnrollmentService from './career.enrollment.service';
import UsersService from 'src/modules/users/users.service';

@Injectable()
export default class CareerPathService {
  constructor(
    @InjectRepository(CareerPath)
    private readonly careerPathRepository: Repository<CareerPath>,
    private readonly roadMapService: RoadMapService,
    private readonly careerEnrollmentService: CareerEnrollmentService,
    private readonly userService: UsersService
  ) {}

  async findOne(id: string) {
    return this.careerPathRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  async careerpathEnrollmentCheck(
    userId: string,
    careerpathId: string
  ): Promise<boolean> {
    const isEnrolled = await this.careerPathRepository
      .createQueryBuilder('careerpath')
      .leftJoin('careerpath.careerpathEnrollments', 'enrollment')
      .leftJoin('enrollment.user', 'user')
      .where('careerpath.id = :careerpathId', { careerpathId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return !!isEnrolled;
  }

  async listCareerPaths(): Promise<CareerPathContext[]> {
    const careerPaths = await this.careerPathRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
    const careerpath = careerPaths.map((path) => ({
      id: path.id,
      title: path.title,
      description: path.description,
    }));
    return careerpath;
  }

  async careerPathDetailsUser(
    id: string,
    userId: string
  ): Promise<CareerPathDetails> {
    const careerpathDetails = await this.carrerPathDetails(id);
    const isEnrolled = await this.careerpathEnrollmentCheck(userId, id);
    return {
      ...careerpathDetails,
      isEnrolled: isEnrolled,
    };
  }

  async carrerPathDetails(id: string): Promise<CareerPathDetails> {
    const careerPath = await this.careerPathRepository
      .createQueryBuilder('careerPath')
      .leftJoinAndSelect('careerPath.roadmaps', 'roadmapMapper')
      .leftJoinAndSelect('roadmapMapper.roadmap', 'roadmap')
      .where('careerPath.id = :id', { id })
      .getOne();

    if (!careerPath) throw new Error('Career Path not found');

    const roadmaps = await Promise.all(
      careerPath.roadmaps.map((mapper) =>
        this.roadMapService.roadmapDetails(mapper.roadmap.id)
      )
    );

    return {
      id: careerPath.id,
      title: careerPath.title,
      description: careerPath.description,
      roadmaps,
    };
  }

  async enrollinCareerpath(userId: string, careerpathId: string) {
    const careerPath = await this.findOne(careerpathId);

    if (!careerPath) {
      throw new Error('Career Path not found');
    }

    const user = await this.userService.findOne(userId);
    if (!user) throw new Error('User not found');

    const isEnrolled = await this.careerpathEnrollmentCheck(
      userId,
      careerpathId
    );
    if (isEnrolled)
      throw new Error('User already enrolled in this career path');

    return await this.careerEnrollmentService.create(user, careerPath);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { CareerEnrollment } from '../entities/career-enrollment.entity';
import { User } from '../entities/dto';
import { CareerPath } from '../entities/career-path.entity';

@Injectable()
export default class CareerEnrollmentService {
  constructor(
    @InjectRepository(CareerEnrollment)
    private readonly careerEnrollmentRepository: Repository<CareerEnrollment>
  ) {}

  async create(user: User, careerPath: CareerPath) {
    return this.careerEnrollmentRepository.save(
      this.careerEnrollmentRepository.create({
        user,
        careerPath,
      })
    );
  }

  async findOne(id: string) {
    return this.careerEnrollmentRepository.findOne({
      where: { id: Equal(id) },
    });
  }
}

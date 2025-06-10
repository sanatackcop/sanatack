import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Enrollment } from '../entities/enrollment';
import User from 'src/modules/users/entities/user.entity';
import { Course } from '../entities/courses.entity';

@Injectable()
export default class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly courseEnrollmentRepository: Repository<Enrollment>
  ) {}

  async create(user: User, course: Course) {
    return this.courseEnrollmentRepository.save(
      this.courseEnrollmentRepository.create({
        user,
        course,
      })
    );
  }

  async findOne(id: string) {
    return this.courseEnrollmentRepository.findOne({
      where: { id: Equal(id) },
    });
  }
}

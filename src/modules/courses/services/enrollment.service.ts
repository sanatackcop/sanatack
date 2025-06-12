import { Enrollment } from 'src/modules/courses/entities/enrollment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import User from 'src/modules/users/entities/user.entity';
import { Course } from '../entities/courses.entity';

@Injectable()
export default class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>
  ) {}

  async create(user: User, course: Course) {
    return this.enrollmentRepo.save(
      this.enrollmentRepo.create({
        user,
        course,
        progress_count: 0,
        is_finished: false,
      })
    );
  }

  async findOne(id: string) {
    return this.enrollmentRepo.findOne({
      where: { id: Equal(id) },
    });
  }

  async updateProgressCount(userId: string, course_id: string) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: {
        course: { id: Equal(course_id) },
        user: { id: Equal(userId) },
      },
      relations: { course: true },
      select: { progress_count: true, course: { material_count: true } },
    });
    if (enrollment.progress_count + 1 <= enrollment.course.material_count)
      await this.enrollmentRepo.update(enrollment, {
        progress_count: enrollment.progress_count++,
      });
    else if (!enrollment.is_finished) {
      await this.enrollmentRepo.update(enrollment, {
        is_finished: true,
      });
    }
  }

  async findOneByCourseAndUser(course_id: string, user_id: string) {
    return this.enrollmentRepo.findOne({
      where: { course: { id: Equal(course_id) }, user: { id: Equal(user_id) } },
    });
  }

  getCurrentCoursesForUser(user_id: string) {
    return this.enrollmentRepo.find({
      where: { user: { id: Equal(user_id) }, is_finished: false },
      relations: { course: true },
    });
  }
}

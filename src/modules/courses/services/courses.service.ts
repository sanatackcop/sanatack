import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, FindOptionsWhere, Repository } from 'typeorm';
import { Course } from '../entities/courses.entity';
import { Module } from '../entities/module.entity';
import {
  CourseDetails,
  CoursesContext,
  CreateNewCourseDto,
} from '../entities/dto';
import { CourseMapper } from '../entities/courses-maper.entity';
import UsersService from 'src/modules/users/users.service';
import EnrollmentService from './enrollment.service';
import ModuleService from './module.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly moduleService: ModuleService,
    private readonly userService: UsersService,
    private readonly enrollmentService: EnrollmentService
  ) {}

  async create({
    title,
    description,
    level,
    tags,
    isPublish,
    modules,
  }: CreateNewCourseDto): Promise<Course> {
    return this.dataSource.transaction(async (manager) => {
      const course = manager.create(Course, {
        title: title,
        description: description,
        level: level,
        tags: tags,
        isPublished: isPublish,
      });
      await manager.save(course);

      for (const [moduleIndex, mDto] of modules.entries()) {
        const module = await manager.findOne(Module, {
          where: { id: mDto.id },
        });
        if (!module)
          throw new NotFoundException(`Module ${mDto.id} was not found`);

        const courseMapper = manager.create(CourseMapper, {
          course,
          module,
          order: moduleIndex + 1,
        });
        await manager.save(courseMapper);
      }

      return course;
    });
  }

  async list({
    userId,
    courseStatus,
  }: {
    userId?: string;
    courseStatus?: any;
  }): Promise<CoursesContext[]> {
    const where: FindOptionsWhere<Course> = {};
    if (userId) where.isPublished = true;

    if (courseStatus) {
      const courses = this.getProgressCourses(userId, courseStatus);
      return courses;
    }
    const courses = await this.courseRepository.find({
      where,
      order: { created_at: 'DESC' },
    });

    const response = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description?.substring(0, 100),
      level: course.level,
      isPublished: course.isPublished,
      tags: course.tags,
    }));

    return response;
  }

  private getProgressCourses(
    userId: string,
    courseStatus
  ): Promise<CoursesContext[]> {
    // const query = this.dataSource
    //   .getRepository(CourseProgress)
    //   .createQueryBuilder('progress')
    //   .innerJoinAndSelect('progress.course', 'course')
    //   .where('progress.userId = :userId', { userId })
    //   .orderBy('course.createdAt', 'DESC');

    // if (courseStatus === 'done') {
    //   query.andWhere('progress.progress = :progress', { progress: 100 });
    // } else if (courseStatus === 'inProgress') {
    //   query.andWhere(
    //     'progress.progress > :progressMin AND progress.progress < :progressMax',
    //     { progressMin: 0, progressMax: 100 }
    //   );
    // }

    // const courses = await query.getMany();

    // const progressCourses = courses.map(({ course }) => ({
    //   id: course.id,
    //   title: course.title,
    //   description: course.description?.substring(0, 100),
    //   level: course.level,
    //   tags: course.tags,
    // }));

    // return progressCourses;
    throw new Error('Not Implemented' + userId + courseStatus);
  }

  async enrollinCourse(userId: string, courseId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new Error('Course not found');
    }
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isEnrolled = await this.courseEnrollmentCheck(userId, courseId);
    if (isEnrolled) {
      throw new Error('User is already enrolled in this course');
    }

    return await this.enrollmentService.create(user, course);
  }

  private async courseEnrollmentCheck(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const isEnrolled = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoin('course.enrollment', 'enrollment')
      .leftJoin('enrollment.user', 'user')
      .where('course.id = :courseId', { courseId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return !!isEnrolled;
  }

  async courseDetails(id: string): Promise<CourseDetails> {
    const course = await this.courseRepository.findOneOrFail({
      where: { id: Equal(id) },
      relations: {
        courseMappers: {
          module: { lessonMappers: { lesson: { materialMapper: true } } },
        },
      },
    });

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      tags: course.tags,
      modules: await Promise.all(
        course.courseMappers.map(
          async (mapper) => await this.moduleService.getDetails(mapper.module)
        ) ?? []
      ),
    };
  }

  async courseDetailsUser(id: string, userId: string): Promise<CourseDetails> {
    const courseDetails = await this.courseDetails(id);
    const isEnrolled = await this.courseEnrollmentCheck(userId, id);
    return {
      ...courseDetails,
      isEnrolled: isEnrolled,
    };
  }

  update(userId: string, courseId: string, progress: number) {
    // let rec = await this.courseProgressRepo.findOne({
    //   where: { user: { id: userId }, course: { id: courseId } },
    // });
    // if (!rec) {
    //   const course = await this.courseRepository.findOneByOrFail({
    //     id: courseId,
    //   });
    //   rec = this.courseProgressRepo.create({
    //     course,
    //     user: { id: userId } as any,
    //     progress,
    //   });
    // } else {
    //   rec.progress = progress;
    // }
    // return this.courseProgressRepo.save(rec);
    throw new Error('Not Implemented' + userId + courseId + progress);
  }

  get(userId: string, courseId: string) {
    // const rec = await this.courseProgressRepo.findOne({
    //   where: { user: { id: userId }, course: { id: courseId } },
    // });
    // return rec?.progress ?? 0;
    // throw new Error('Not Implemented' + userId + courseId);
    return 0;
  }

  getCurrentCoursesForUser(userId: string) {
    // const currentCourese = await this.courseProgressRepo.find({
    //   where: {
    //     user: { id: Equal(userId) },
    //   },
    //   relations: ['course'],
    //   order: { updatedAt: 'DESC' },
    // });

    // const response = currentCourese.map((course) => ({
    //   id: course.course.id,
    //   title: course.course.title,
    //   description: course.course.description?.substring(0, 100),
    //   level: course.course.level,
    //   tags: course.course.tags,
    // }));
    // return response;
    throw new Error('Not Implemented' + userId);
  }
}

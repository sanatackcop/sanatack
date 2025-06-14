import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, Repository } from 'typeorm';
import { Course } from '../entities/courses.entity';
import {
  CourseDetails,
  CoursesContext,
  CreateNewCourseDto,
} from '../entities/dto';
import UsersService from 'src/modules/users/users.service';
import EnrollmentService from './enrollment.service';
import ModuleService from './module.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly moduleService: ModuleService,
    private readonly userService: UsersService,
    private readonly enrollmentService: EnrollmentService
  ) {}

  create(course: CreateNewCourseDto): Promise<Course> {
    return this.courseRepository.save(
      this.courseRepository.create({
        title: course.title,
        description: course.description,
        level: course.level,
        course_info: course.course_info,
        isPublished: course.isPublish,
        material_count: 0,
      })
    );
  }

  async findOne(id: string) {
    return this.courseRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  async findModuleById(id: string) {
    return this.moduleService.findOne(id);
  }

  async list(userId?: string): Promise<CoursesContext[]> {
    const where: FindOptionsWhere<Course> = {};
    if (userId) where.isPublished = true;

    //! fix me
    // if (courseStatus) {
    //   const courses = this.getProgressCourses(userId, courseStatus);
    //   return courses;
    // }
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
      course_info: course.course_info,
    }));

    return response;
  }

  async getProgressCourses(userId: string, course_id: string): Promise<number> {
    const course = await this.courseRepository.findOneBy({
      id: course_id,
    });
    const getEnrollment = await this.enrollmentService.findOneByCourseAndUser(
      course.id,
      userId
    );
    return (getEnrollment.progress_count / course.material_count) * 100;
  }

  async increaseProgress(userId: string, course_id: string): Promise<void> {
    return await this.enrollmentService.updateProgressCount(userId, course_id);
  }

  async enrollingCourse(userId: string, courseId: string) {
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
      course_info: course.course_info,
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

  update(course_id: string, course: Partial<Course>) {
    return this.courseRepository.update(course_id, course);
  }

  async getCurrentCoursesForUser(userId: string) {
    const currentCourses =
      await this.enrollmentService.getCurrentCoursesForUser(userId);

    const response = currentCourses.map((cc) => ({
      id: cc.course.id,
      title: cc.course.title,
      description: cc.course.description?.substring(0, 100),
      level: cc.course.level,
      isPublished: cc.course.isPublished,
      course_info: cc.course.course_info,
      created_at: cc.course.created_at,
    }));

    return response;
  }
}

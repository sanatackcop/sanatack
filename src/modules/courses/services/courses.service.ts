import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Course } from '../entities/courses.entity';
import {
  CourseDetails,
  CoursesContext,
  CreateNewCourseDto,
  ModuleDetails,
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

  async list(userId: string): Promise<CoursesContext[]> {
    const courses = await this.courseRepository.find({
      order: { created_at: 'DESC' },
    });

    if (!courses || courses.length === 0) return [];

    return Promise.all(
      courses.map((course) => this.courseDetails(course.id, userId))
    );
  }

  async getProgressCourses(userId: string, course_id: string): Promise<number> {
    const course = await this.courseRepository.findOneBy({
      id: course_id,
    });
    const getEnrollment = await this.enrollmentService.findOneByCourseAndUser(
      course.id,
      userId
    );
    return (getEnrollment.progress_counter / course.material_count) * 100;
  }

  async increaseProgress(
    userId: string,
    course_id: string,
    current_material_id: string
  ): Promise<void> {
    return await this.enrollmentService.updateProgressCount(
      userId,
      course_id,
      current_material_id
    );
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

    const enrollment = await this.enrollmentService.findOneByCourseAndUser(
      courseId,
      userId
    );
    if (enrollment) throw new Error('User is already enrolled in this course');

    await this.update(course.id, {
      enrolledCount: course.enrolledCount + 1,
    });
    return await this.enrollmentService.create(user, course);
  }

  async courseDetails(
    course_id: string,
    user_id: string
  ): Promise<CourseDetails> {
    const enrollment = await this.enrollmentService.findOneByCourseAndUser(
      course_id,
      user_id,
      {
        course: {
          courseMappers: {
            module: { lessonMappers: { lesson: { materialMapper: true } } },
          },
        },
      }
    );

    let course: Course;

    if (!enrollment)
      course = await this.courseRepository.findOne({
        where: { id: Equal(course_id) },
        relations: {
          courseMappers: {
            module: { lessonMappers: { lesson: { materialMapper: true } } },
          },
        },
      });
    else course = enrollment.course;

    if (!course)
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      course_info: {
        ...course.course_info,
        durationHours: Math.floor(course.course_info.durationHours / 60),
      },
      isPublished: course.isPublished,
      isEnrolled: enrollment ? true : false,
      enrolledCount: course.enrolledCount,
      projectsCount: 0,
      current_material: enrollment.current_material_id,
      completionRate: course.completionCount
        ? (course.completionCount / course.enrolledCount) * 100
        : 0,

      modules: (
        await Promise.all(
          course.courseMappers.map(async (mapper) => {
            if (mapper.module)
              return await this.moduleService.getDetails(mapper.module);
          })
        )
      ).map((module) => {
        if (!module) return [] as unknown as ModuleDetails;
        const courseMapper = course.courseMappers.find(
          (mapper) => mapper.module.id === module.id
        );
        return { ...module, order: courseMapper.order };
      }),

      ...(() => {
        return enrollment
          ? {
              progress:
                (enrollment.progress_counter / course.material_count) * 100,
            }
          : {};
      })(),
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
      progress: cc.progress_counter,
    }));

    return response;
  }

  async countCompletedCourses(userId: string) {
    return await this.enrollmentService.getCompletedCoursesCount(userId);
  }

  async getCompletedHours(userId: string) {
    return await this.enrollmentService.getCompletedHours(userId);
  }

  async getStreak(userId: string) {
    return await this.enrollmentService.getStreak(userId);
  }
}

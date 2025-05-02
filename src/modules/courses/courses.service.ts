import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Course } from './entities/courses.entity';
import { Module } from './entities/module.entity';
import { CourseDetails, CoursesContext, CreateNewCourseDto } from './dto';
import { CourseMapper } from './entities/courses-maper.entity';
import { Quiz } from './entities/quiz.entity';
import { Resource } from './entities/resource.entity';
import { Lesson } from './entities/lessons.entity';
import { LessonMapper } from './entities/lessons-maper.entity';
import { VideoResource } from './entities/video-lessons.entity';
import { CourseProgress } from './entities/course-progress';
import { Enrollment } from './entities/enrollment';
import { User } from '../users/entities/user.entity';
import { MaterialType } from './entities/material-mapper';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(VideoResource)
    private readonly videoRepository: Repository<VideoResource>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly dataSource: DataSource
  ) {}

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
      order: { createdAt: 'DESC' },
    });

    const response = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description?.substring(0, 100),
      level: course.level,
      tags: course.tags,
    }));

    return response;
  }
  private async getProgressCourses(
    userId: string,
    courseStatus
  ): Promise<CoursesContext[]> {
    const query = this.dataSource
      .getRepository(CourseProgress)
      .createQueryBuilder('progress')
      .innerJoinAndSelect('progress.course', 'course')
      .where('progress.userId = :userId', { userId })
      .orderBy('course.createdAt', 'DESC');

    if (courseStatus === 'done') {
      query.andWhere('progress.progress = :progress', { progress: 100 });
    } else if (courseStatus === 'inProgress') {
      query.andWhere(
        'progress.progress > :progressMin AND progress.progress < :progressMax',
        { progressMin: 0, progressMax: 100 }
      );
    }

    const courses = await query.getMany();

    const progressCourses = courses.map(({ course }) => ({
      id: course.id,
      title: course.title,
      description: course.description?.substring(0, 100),
      level: course.level,
      tags: course.tags,
    }));

    return progressCourses;
  }

  async enroll(userId: string, courseId: string) {
    const result = await this.dataSource.transaction(async (manager) => {
      const course = await manager.findOne(Course, { where: { id: courseId } });

      if (!course) {
        throw new Error('Course not found');
      }
      const user = await manager.findOne(User, { where: { id: userId } });

      if (!user) {
        throw new Error('User not found');
      }

      const isEnrolled = await manager
        .createQueryBuilder(Enrollment, 'enrollment')
        .leftJoin('enrollment.course', 'course')
        .leftJoin('enrollment.user', 'user')
        .where('course.id = :courseId', { courseId })
        .andWhere('user.id = :userId', { userId })
        .getOne();

      if (isEnrolled) {
        throw new Error('User is already enrolled in this course');
      }

      const enrollment = manager.create(Enrollment, {
        user: user,
        course: course,
      });
      await manager.save(enrollment);

      return enrollment;
    });
  }

  private async enrollmentCheck(userId: string, courseId: string) {
    const isEnrolled = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoin('course.enrollment', 'enrollment')
      .leftJoin('enrollment.user', 'user')
      .where('course.id = :courseId', { courseId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return isEnrolled;
  }

  async courseDetails(id: string, userId: string): Promise<CourseDetails> {
    const isEnrolled = await this.enrollmentCheck(userId, id);

    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.courseMappers', 'mapper')
      .leftJoinAndSelect('mapper.module', 'module')
      .leftJoinAndSelect('module.lessonMappers','lessonMapper')
      .leftJoinAndSelect('lessonMapper.lesson','lesson')
      .innerJoinAndSelect('lesson.materialMapper','materialMapper')
      .where('course.id = :cid', { cid: id })
      .getOne();

    if (!course) {
      throw new Error('Course not found');
    }

    return {
      id: course.id,
      isEnrolled: !!isEnrolled,
      title: course.title,
      description: course.description,
      level: course.level,
      tags: course.tags,
      modules: course.courseMappers.map((mapper) => ({
        id: mapper.module.id,
        title: mapper.module.title,
        lessons: mapper.module.lessonMappers?.map((lessonMapper) => ({
          id: lessonMapper.lesson.id,
          name: lessonMapper.lesson.name,
          description: lessonMapper.lesson.description,
          order: lessonMapper.lesson.order,
          materials: lessonMapper.lesson.materialMapper?.map(async (material) => {
            if (material.material_type == MaterialType.QUIZ) {
              const quiz = await this.quizRepository.findOne({ where: { id: material.material_id } });
              return quiz ? {
                type: MaterialType.QUIZ,
                quiz: {
                  id: quiz.id,
                  question: quiz.question,
                  options: quiz.options,
                  correctAnswer: quiz.correctAnswer,
                  explanation: quiz.explanation,
                },
              } : null;
            } else if (material.material_type == MaterialType.VIDEO) {
              const video = await this.videoRepository.findOne({ where: { id: material.material_id } });
              return video ? {
                type: MaterialType.VIDEO,
                video: {
                  id: video.id,
                  title: video.title,
                  youtubeId: video.youtubeId,
                  duration: video.duration,
                  description: video.description,
                },
              } : null;
            } else if (material.material_type == MaterialType.RESOURCE) {
              const resource = await this.resourceRepository.findOne({ where: { id: material.material_id } });
              return resource ? {
                type: MaterialType.RESOURCE,
                resource: {
                  id: resource.id,
                  title: resource.title,
                  url: resource.url,
                  content: resource.content,
                  description: resource.description,
                },
              } : null;
            }
            return null;
          }),
        })),
      })),
    };
  }

  async createNewCourse({
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
        let module: Module;
        if (mDto.isExisting && mDto.id) {
          module = await manager.findOne(Module, { where: { id: mDto.id } });
          if (!module) {
            throw new NotFoundException(`Module ${mDto.id} was not found`);
          }
        } else {
          module = manager.create(Module, { title: mDto.title });
          await manager.save(module);
        }

        const courseMapper = manager.create(CourseMapper, {
          course,
          module,
          order: moduleIndex + 1,
        });
        await manager.save(courseMapper);

        for (const [lessonIdx, lDto] of mDto.lessons.entries()) {
          let lesson: Lesson;
          if (lDto.isExisting && lDto.id) {
            lesson = await manager.findOne(Lesson, { where: { id: lDto.id } });
            if (!lesson) {
              throw new NotFoundException(`Lesson ${lDto.id} was not found`);
            }
          } else {
            lesson = manager.create(Lesson, {
              name: lDto.name,
              description: lDto.description,
              order: lDto.order ?? lessonIdx + 1,
            });
            await manager.save(lesson);
          }

          const lessonMapper = manager.create(LessonMapper, {
            module,
            lesson,
            order: lesson.order,
          });
          await manager.save(lessonMapper);

          if (lDto.videos?.length) {
            for (const vDto of lDto.videos) {
              let video: VideoResource;

              video = manager.create(VideoResource, {
                title: 'Lesson video',
                // source: vDto.source,
                // description: vDto.description,
                // duration: vDto.duration,
                youtubeId: vDto.url,
                lesson,
              });

              await manager.save(video);
            }
          }

          if (lDto.resources?.length) {
            for (const rDto of lDto.resources) {
              let resource: Resource;
              if (rDto.isExisting && rDto.id) {
                resource = await manager.findOne(Resource, {
                  where: { id: rDto.id },
                });
                if (!resource) {
                  throw new NotFoundException(`Resource ${rDto.id} not found`);
                }
              } else {
                resource = manager.create(Resource, {
                  title: rDto.title,
                  description: rDto.description,
                  type: rDto.type,
                  url: rDto.url,
                  content: rDto.content,
                  lesson,
                });
                await manager.save(resource);
              }
            }
          }

          if (lDto.quizzes?.length) {
            for (const qDto of lDto.quizzes) {
              let quiz: Quiz;
              if (qDto.isExisting && qDto.id) {
                quiz = await manager.findOne(Quiz, { where: { id: qDto.id } });
                if (!quiz) {
                  throw new NotFoundException(`Quiz ${qDto.id} not found`);
                }
              } else {
                quiz = manager.create(Quiz, {
                  question: qDto.question,
                  options: qDto.options,
                  correctAnswer: qDto.correctAnswer,
                  explanation: qDto.explanation,
                  lesson,
                });
                await manager.save(quiz);
              }
            }
          }
        }
      }

      return course;
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Course } from '../entities/courses.entity';
import { Module } from '../entities/module.entity';
import {
  CourseDetails,
  CoursesContext,
  CreateNewCourseDto,
} from '../entities/dto';
import { CourseMapper } from '../entities/courses-maper.entity';
import { Quiz } from '../entities/quiz.entity';
import { Resource } from '../entities/resource.entity';
import { Lesson } from '../entities/lessons.entity';
import { LessonMapper } from '../entities/lessons-maper.entity';
import { VideoResource } from '../entities/video-lessons.entity';
import { MaterialMapper, MaterialType } from '../entities/material-mapper';
import QuizService from './quiz.service';
import VideoService from './video.service';
import ResourceService from './resource.service';
import UsersService from 'src/modules/users/users.service';
import EnrollmentService from './enrollment.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly quizService: QuizService,
    private readonly videoService: VideoService,
    private readonly resourceService: ResourceService,
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

        for (const lDto of mDto.lessons.values()) {
          const lesson = await manager.findOne(Lesson, {
            where: { id: lDto.id },
          });
          if (!lesson)
            throw new NotFoundException(`Lesson ${lDto.id} was not found`);

          const lessonMapper = manager.create(LessonMapper, {
            module,
            lesson,
            order: lesson.order,
          });
          await manager.save(lessonMapper);

          let materialOrder = 0;

          if (lDto.videos?.length) {
            for (const vDto of lDto.videos) {
              const video = manager.create(VideoResource, {
                title: 'Lesson video',
                // source: vDto.source,
                // description: vDto.description,
                // duration: vDto.duration,
                youtubeId: vDto.url,
              });

              await manager.save(video);

              const videoMapper = manager.create(MaterialMapper, {
                lesson,
                material_id: video.id,
                material_type: MaterialType.VIDEO,
                order: materialOrder++,
              });
              await manager.save(videoMapper);
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
                });
                await manager.save(resource);
              }
              const resourceMapper = manager.create(MaterialMapper, {
                lesson,
                material_id: resource.id,
                material_type: MaterialType.RESOURCE,
                order: materialOrder++,
              });
              await manager.save(resourceMapper);
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
                });
                await manager.save(quiz);
              }
              const quizMapper = manager.create(MaterialMapper, {
                lesson,
                material_id: quiz.id,
                material_type: MaterialType.QUIZ,
                order: materialOrder++,
              });
              await manager.save(quizMapper);
            }
          }
        }
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
      order: { createdAt: 'DESC' },
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
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.courseMappers', 'mapper')
      .leftJoinAndSelect('mapper.module', 'module')
      .leftJoinAndSelect('module.lessonMappers', 'lessonMapper')
      .leftJoinAndSelect('lessonMapper.lesson', 'lesson')
      .leftJoinAndSelect('lesson.materialMapper', 'materialMapper')
      .where('course.id = :cid', { cid: id })
      .getOne();

    if (!course) {
      throw new Error('Course not found');
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      tags: course.tags,
      modules: await Promise.all(
        course.courseMappers.map(async (mapper) => ({
          id: mapper.module.id,
          title: mapper.module.title,
          lessons: await Promise.all(
            mapper.module.lessonMappers?.map(async (lessonMapper) => ({
              id: lessonMapper.lesson.id,
              name: lessonMapper.lesson.name,
              description: lessonMapper.lesson.description,
              order: lessonMapper.lesson.order,
              materials: (
                await Promise.all(
                  lessonMapper.lesson.materialMapper?.map(async (material) => {
                    if (material.material_type === MaterialType.QUIZ) {
                      const quiz = await this.quizService.findOne(
                        material.material_id
                      );
                      return quiz
                        ? {
                            order: material.order,
                            type: MaterialType.QUIZ,
                            quiz: {
                              id: quiz.id,
                              question: quiz.question,
                              options: quiz.options,
                              correctAnswer: quiz.correctAnswer,
                              explanation: quiz.explanation,
                            },
                          }
                        : null;
                    } else if (material.material_type === MaterialType.VIDEO) {
                      const video = await this.videoService.findOne(
                        material.material_id
                      );
                      return video
                        ? {
                            order: material.order,
                            type: MaterialType.VIDEO,
                            video: {
                              id: video.id,
                              title: video.title,
                              youtubeId: video.youtubeId,
                              duration: video.duration,
                              description: video.description,
                            },
                          }
                        : null;
                    } else if (
                      material.material_type === MaterialType.RESOURCE
                    ) {
                      const resource = await this.resourceService.findOne(
                        material.material_id
                      );
                      console.log({ resource });
                      return resource
                        ? {
                            order: material.order,
                            type: MaterialType.RESOURCE,
                            resource: {
                              id: resource.id,
                              title: resource.title,
                              url: resource.url,
                              content: resource.content,
                              description: resource.description,
                            },
                          }
                        : null;
                    }
                    return null;
                  }) ?? []
                )
              ).sort((a, b) => {
                return a.order - b.order;
              }),
            })) ?? []
          ),
        })) ?? []
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

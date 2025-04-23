import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, DataSource, Repository } from 'typeorm';
import { Course } from './entities/courses.entity';
import { CourseResponse } from '../admin/dto';
import { Module } from './entities/module.entity';
import { CourseDetails, Courses, CreateNewCourseDto } from './dto';
import { CourseMapper } from './entities/courses-maper.entity';
import { Quiz } from './entities/quiz.entity';
import { Resource } from './entities/resource.entity';
import { Lesson } from './entities/lessons.entity';
import { LessonMapper } from './entities/lessons-maper.entity';
import { VideoResource } from './entities/video-lessons.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly dataSource: DataSource
  ) {}

  async list(): Promise<CourseResponse[]> {
    const courses = await this.courseRepository.find();

    const res = courses.map((course) => {
      return {
        id: course.id,
        title: course.title.toUpperCase(),
        description: course.description?.substring(0, 100),
        isPublish: course.isPublished,
      };
    });

    return res;
  }

  async courses(): Promise<Courses[]> {
    const courses = await this.courseRepository.find({
      where: { isPublished: true },
      order: {createdAt: 'DESC'}
    });
  
    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description?.substring(0, 100),
      level: course.level,
      tags: course.tags,
    }));
  }

  async courseDetails(id: number) : Promise<CourseDetails>{
    const course = await this.courseRepository.createQueryBuilder('course')
    .innerJoinAndSelect('course.courseMappers','mapper')
    .innerJoinAndSelect('mapper.module','module')
    .innerJoinAndSelect('module.lessonMappers','lessonmapper')
    .innerJoinAndSelect('lessonmapper.lesson','lesson')
    .innerJoinAndSelect('lesson.resources','resources')
    .innerJoinAndSelect('lesson.quizzes','quizzes')
    .innerJoinAndSelect('lesson.videos','videos')
    .where('course.id = :cid',{cid: id})
    .getOne();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level,
          tags: course.tags,
          modules: course.courseMappers.map((mapper) => {
            const module = mapper.module;
            return {
              id: module.id,
              title: module.title,
              lessons: module.lessonMappers?.map((lessonmapper) => {
                const lesson = lessonmapper.lesson;
                return {
                  id: lesson.id,
                  name: lesson.name,
                  description: lesson.description,
                  order: lesson.order,
                  resources: lesson.resources?.map((resource) => ({
                    id: resource.id,
                    title: resource.title,
                    url: resource.url,
                    content: resource.content
                  })) || [],
                  quizzes: lesson.quizzes?.map((quiz) => ({
                    id: quiz.id
                  })) || [],
                  videos: lesson.videos?.map((video) => ({
                    id: video.id,
                    title: video.title,
                    description: video.description,
                    duration: video.duration,
                  })) || [],
                };
              }) || [],
            };
          }),
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
                title:  'Lesson video',
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

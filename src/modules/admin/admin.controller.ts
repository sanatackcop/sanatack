import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoursesService } from '../courses/services/courses.service';
import {
  CreateCareerPathDto,
  CreateNewCourseDto,
  CreateRoadmapDto,
  LessonDto,
  MaterialLessonMapDto,
  ModuleDto,
  ModuleLessonDto,
  QuizDto,
  ResourceDto,
  VideoDto,
} from '../courses/entities/dto';
import RoadMapService from '../courses/services/roadmap.service';
import CareerPathService from '../courses/services/career.path.service';
import QuizService from '../courses/services/quiz.service';
import VideoService from '../courses/services/video.service';
import ResourceService from '../courses/services/resource.service';
import LessonService from '../courses/services/lesson.service';
import LessonMapperService from '../courses/services/lesson.mapper';
import MaterialMapperService from '../courses/services/material.mapper.service';
import ModuleService from '../courses/services/module.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly roadmapService: RoadMapService,
    private readonly careerPathService: CareerPathService,
    private readonly quizService: QuizService,
    private readonly videoService: VideoService,
    private readonly resourceService: ResourceService,
    private readonly lessonService: LessonService,
    private readonly materialMapper: MaterialMapperService,
    private readonly moduleService: ModuleService,
    private readonly lessonMapper: LessonMapperService
  ) {}

  @Get('/courses')
  async getCourses() {
    return await this.coursesService.list({});
  }

  @Post('/courses/new-course')
  async uploadCourse(
    @Body()
    { title, description, tags, level, isPublish, modules }: CreateNewCourseDto
  ) {
    return await this.coursesService.create({
      title,
      description,
      tags,
      level,
      isPublish,
      modules,
    });
  }

  @Post('roadmaps/new-roadmap')
  async uploadRoadmap(@Body() data: CreateRoadmapDto) {
    return await this.roadmapService.create(data);
  }

  @Post('careerpaths/new-careerpath')
  async uploadCareerPath(@Body() data: CreateCareerPathDto) {
    return await this.careerPathService.create(data);
  }

  @Post('/quizzes')
  async createNewQuiz(@Body() data: QuizDto) {
    return await this.quizService.create(data);
  }

  @Get('/quizzes')
  async getAllQuiz() {
    return await this.quizService.getAll();
  }

  @Post('/videos')
  async createNewVideo(@Body() data: VideoDto) {
    return await this.videoService.create(data);
  }

  @Get('/videos')
  async getAllVideos() {
    return await this.videoService.getAll();
  }

  @Post('/resources')
  async createNewResource(@Body() data: ResourceDto) {
    return await this.resourceService.create(data);
  }

  @Get('/resources')
  async getAllResource() {
    return await this.resourceService.getAll();
  }

  @Post('/lessons')
  async createLesson(@Body() lesson: LessonDto) {
    return await this.lessonService.create(lesson);
  }

  @Get('/lessons')
  async getLessons() {
    return await this.lessonService.find();
  }

  @Post('/mapper/material')
  async linkQuizToLesson(@Body() linkQuiz: MaterialLessonMapDto) {
    try {
      const d = await this.materialMapper.create({
        lesson: { id: linkQuiz.lesson_id },
        material_id: linkQuiz.material_id,
        material_type: linkQuiz.type,
        order: linkQuiz.order,
      });
      return d;
    } catch (error: unknown) {
      console.log({ error });
    }
  }

  @Get('/mapper/:lesson_id/materials')
  async getAllMappedQuizzes(@Param('lesson_id') lesson_id: string) {
    try {
      return await this.materialMapper.findAllMaterialsByLesson(lesson_id);
    } catch (error: unknown) {
      console.log({ error });
    }
  }

  @Get('/modules')
  async getAllModules() {
    try {
      return await this.moduleService.getAll();
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/modules')
  async createModule(@Body() module: ModuleDto) {
    try {
      return await this.moduleService.create(module);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('mapper/:module_id/lesson')
  async linkLessonToModule(
    @Param('module_id') id: string,
    @Body() lesson: ModuleLessonDto
  ) {
    try {
      return await this.lessonMapper.create({
        module: { id },
        lesson: { id: lesson.lesson_id },
        order: lesson.order,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/mapper/:module_id/lessons')
  async getAllMappedLessons(@Param('module_id') module_id: string) {
    try {
      return await this.lessonMapper.getAllLinkedByLessons(module_id);
    } catch (error: unknown) {
      console.log({ error });
    }
  }
}

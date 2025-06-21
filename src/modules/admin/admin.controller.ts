import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CoursesService } from '../courses/services/courses.service';
import {
  ArticleDto,
  CourseModuleDto,
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
import CourseMapperService from '../courses/services/courses.mapper.service';
import { MaterialType } from '../courses/entities/material-mapper';
import Quiz from '../courses/entities/quiz.entity';
import Video from '../courses/entities/video.entity';
import Resource from '../courses/entities/resource.entity';
import ArticleService from '../courses/services/article.service';
import { Article } from '../courses/entities/article.entity';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly roadmapService: RoadMapService,
    private readonly careerPathService: CareerPathService,
    private readonly quizService: QuizService,
    private readonly videoService: VideoService,
    private readonly articleService: ArticleService,
    private readonly resourceService: ResourceService,
    private readonly lessonService: LessonService,
    private readonly materialMapper: MaterialMapperService,
    private readonly moduleService: ModuleService,
    private readonly lessonMapper: LessonMapperService,
    private readonly courseMapper: CourseMapperService
  ) {}

  @Get('/courses')
  async getCourses(@Query('userId') userId: string) {
    return await this.coursesService.list(userId);
  }

  @Post('/courses/new-course')
  async uploadCourse(@Body() course: CreateNewCourseDto) {
    return await this.coursesService.create(course);
  }

  @Get('/mapper/:course_id/modules')
  async getAllMappedModules(@Param('course_id') course_id: string) {
    try {
      return await this.courseMapper.getAllLinkedByModules(course_id);
    } catch (error: unknown) {
      console.log({ error });
    }
  }

  @Post('mapper/:course_id/modules')
  async linkModuleToCourses(
    @Param('course_id') id: string,
    @Body() module: CourseModuleDto
  ) {
    try {
      return await this.courseMapper.create({
        course: { id },
        module: { id: module.module_id },
        order: module.order,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      else throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
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

  // *** Articles
  @Post('/article')
  async createNewArticle(@Body() data: ArticleDto[]) {
    return await this.articleService.create(data);
  }
  @Get('/articles')
  async getAllArticles() {
    return await this.articleService.getAll();
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
  async linkMaterial(@Body() linkQuiz: MaterialLessonMapDto) {
    let material: Quiz | Video | Resource | Article;
    if (linkQuiz.type == MaterialType.QUIZ)
      material = await this.quizService.findOne(linkQuiz.material_id);
    else if (linkQuiz.type == MaterialType.VIDEO)
      material = await this.videoService.findOne(linkQuiz.material_id);
    else if (linkQuiz.type == MaterialType.RESOURCE)
      material = await this.resourceService.findOne(linkQuiz.material_id);
    else if (linkQuiz.type == MaterialType.ARTICLE)
      material = await this.articleService.findOne(linkQuiz.material_id);

    if (!material)
      throw new HttpException(
        `Material with ID ${linkQuiz.material_id} not found`,
        HttpStatus.NOT_FOUND
      );
    return await this.materialMapper.create({
      lesson: { id: linkQuiz.lesson_id },
      material_id: material.id,
      material_type: linkQuiz.type,
      order: linkQuiz.order,
      material_duration: material.duration,
    });
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

  @Get('/roadmaps')
  async getAllRoadmaps() {
    try {
      return await this.roadmapService.getAll();
    } catch (err) {
      console.log(err);
    }
  }
}

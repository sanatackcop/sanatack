import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoursesService } from '../courses/services/courses.service';
import {
  CreateCareerPathDto,
  CreateNewCourseDto,
  CreateRoadmapDto,
  QuizDto,
  ResourceDto,
  VideoDto,
} from '../courses/entities/dto';
import RoadMapService from '../courses/services/roadmap.service';
import CareerPathService from '../courses/services/career.path.service';
import QuizService from '../courses/services/quiz.service';
import VideoService from '../courses/services/video.service';
import ResourceService from '../courses/services/resource.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly roadmapService: RoadMapService,
    private readonly careerPathService: CareerPathService,
    private readonly quizService: QuizService,
    private readonly videoService: VideoService,
    private readonly resourceService: ResourceService
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
}

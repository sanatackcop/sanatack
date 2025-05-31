import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoursesService } from '../courses/services/courses.service';
import {
  CreateCareerPathDto,
  CreateNewCourseDto,
  CreateRoadmapDto,
} from '../courses/entities/dto';
import RoadMapService from '../courses/services/roadmap.service';
import CareerPathService from '../courses/services/career.path.service';

@Controller('admin')
export class ApiController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly roadmapService: RoadMapService,
    private readonly careerPathService: CareerPathService
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
}

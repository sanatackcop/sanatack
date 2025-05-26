import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import {
  CreateCareerPathDto,
  CreateNewCourseDto,
  CreateRoadmapDto,
} from '../courses/dto';

@Controller('admin')
export class ApiController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('/courses')
  async getCourses() {
    return await this.coursesService.list({});
  }

  @Post('/courses/new-course')
  async uploadCourse(
    @Req() req,
    @Body()
    { title, description, tags, level, isPublish, modules }: CreateNewCourseDto
  ) {
    return await this.coursesService.createNewCourse({
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
    return await this.coursesService.createNewRoadmap(data);
  }

  @Post('careerpaths/new-careerpath')
  async uploadCareerPath(@Body() data: CreateCareerPathDto) {
    return await this.coursesService.createNewCareerPath(data);
  }
}

import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CoursesService } from '../courses/services/courses.service';
import { CreateNewCourseDto } from '../courses/entities/dto';

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
    return await this.coursesService.create({
      title,
      description,
      tags,
      level,
      isPublish,
      modules,
    });
  }
}

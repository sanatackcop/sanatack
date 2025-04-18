import { Controller, Get } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';

@Controller({ path: 'api', version: '1' })
export class ApiController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('/courses')
  async getCourses() {
    return await this.coursesService.list();
  }

  @Get('/courses/create')
  async uploadCourse() {
    return await this.coursesService.createNewCourse();
  }
}

import { Controller, Get } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';

@Controller('api')
export class ApiController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('/courses')
  async getCourses() {
    return await this.coursesService.list();
  }
}

import { Controller, Get, HttpException, Param, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesContext, RequestType } from './dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Get('/list')
  async getAllCourses(
    @Req() req: RequestType,
    @Param() courseStatus: {inProgress?: string, done?: string}
  ): Promise<CoursesContext[]> {
    try {
      const userId = req.user.id;
      return await this.courseService.list({courseStatus});
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Get('/:id')
  async getCourseDetails(@Param('id') id: number) {
    try {
      return await this.courseService.courseDetails(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

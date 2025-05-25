import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesContext, RequestType } from './dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Get('/list')
  async getAllCourses(
    @Req() req: RequestType,
    @Param() courseStatus: { inProgress?: string; done?: string }
  ): Promise<CoursesContext[]> {
    try {
      const userId = req.user.id;
      return await this.courseService.list({ courseStatus });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Get('/current')
  async getCurrent(@Req() req: any) {
    try {
      const userId = req.headers.user_id;
      return this.courseService.getCurrentCoursesForUser(userId);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/:id')
  async getCourseDetails(@Req() req, @Param('id') id: string) {
    try {
      const userId = req.headers.user_id;
      return await this.courseService.courseDetailsUser(id, userId);
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }

  @Post('/enroll/:courseId')
  async enrollInCourse(@Req() req: any, @Param('courseId') courseId: string) {
    try {
      const userId = req.headers.user_id;
      return await this.courseService.enrollinCourse(userId, courseId);
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: error }, 500);
    }
  }

  @Post('/enroll/roadmap/:roadmapId')
  async enrollInRoadmap(@Req() req: any, @Param('roadmapId') roadmapId: string) {
    try {
      const userId = req.headers.user_id;
      return await this.courseService.enrollinRoadmap(userId, roadmapId);
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: error }, 500);
    }
  }

  @Post('/enroll/careerpath/:careerpathId')
  async enrollInCareerPath(@Req() req: any, @Param('careerpathId') courseId: string) {
    try {
      const userId = req.headers.user_id;
      return await this.courseService.enrollinCareerpath(userId, courseId);
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: error }, 500);
    }
  }

  @Get('/progress/:courseId')
  async get(@Req() req: any, @Param('courseId') courseId: string) {
    const userId = req.headers.user_id;
    return { progress: await this.courseService.get(userId, courseId) };
  }

  @Patch('/progress/:courseId')
  async update(
    @Req() req,
    @Param('courseId') courseId: string,
    @Body() dto: any
  ) {
    const userId = req.headers.user_id;
    await this.courseService.update(userId, courseId, dto.progress);
    return { success: true };
  }

  @Get('/list/careerpath')
  async getAllCareerPaths(@Req() req: any) {
    try {
      return await this.courseService.listCareerPaths(); 
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Get('/list/roadmap')
  async getAllRoadmaps(@Req() req: any) {
    try {
      return await this.courseService.listRoadmaps();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Get('roadmap/:id')
  async getRoadmapDetails(@Req() req, @Param('id') id: string) {
    try {
      return await this.courseService.roadmapDetails(id);
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }

  @Get('careerpath/:id')
  async getCareerPathDetails(@Req() req, @Param('id') id: string) {
    try {
      return await this.courseService.carrerPathDetails(id);
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }

}

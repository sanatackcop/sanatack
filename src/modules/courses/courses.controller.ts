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
import { CoursesService } from './services/courses.service';
import { CoursesContext, RequestType } from './entities/dto';
import { Request } from 'express';
import RoadMapService from './services/roadmap.service';
import CareerPathService from './services/career.path.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly courseService: CoursesService,
    private readonly roadMapService: RoadMapService,
    private readonly careerPathService: CareerPathService
  ) {}

  @Get('/list')
  async getAllCourses(
    @Req() req: RequestType,
    @Param() courseStatus: { inProgress?: string; done?: string }
  ): Promise<CoursesContext[]> {
    try {
      return await this.courseService.list({ courseStatus });
    } catch (error: unknown) {
      throw new HttpException(error, 500);
    }
  }

  @Get('/current')
  getCurrent(@Req() req: Request) {
    try {
      const userId = req.headers.user_id as string;
      return this.courseService.getCurrentCoursesForUser(userId);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  @Get('/:id')
  async getCourseDetails(@Req() req: Request, @Param('id') id: string) {
    try {
      const userId = req.headers.user_id as string;
      return await this.courseService.courseDetailsUser(id, userId);
    } catch (error: unknown) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }

  @Get('roadmap/:id')
  async getRoadmapDetails(@Req() req: Request, @Param('id') id: string) {
    try {
      const userId = req.headers.user_id as string;
      return await this.roadMapService.roadmapDetailsUser(id, userId);
    } catch (error: unknown) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }

  @Get('careerpath/:id')
  async getCareerPathDetails(@Req() req: Request, @Param('id') id: string) {
    try {
      const userId = req.headers.user_id as string;
      return this.careerPathService.careerPathDetailsUser(id, userId);
    } catch (error: unknown) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }

  @Post('/enroll/:courseId')
  async enrollInCourse(
    @Req() req: Request,
    @Param('courseId') courseId: string
  ) {
    try {
      const userId = req.headers.user_id as string;
      return await this.courseService.enrollinCourse(userId, courseId);
    } catch (error: unknown) {
      console.log(error);
      throw new HttpException({ message: error }, 500);
    }
  }

  @Post('/enroll/roadmap/:roadmapId')
  async enrollInRoadmap(
    @Req() req: Request,
    @Param('roadmapId') roadmapId: string
  ) {
    try {
      const userId = req.headers.user_id as string;
      return await this.roadMapService.enrollingRoadmap(userId, roadmapId);
    } catch (error: unknown) {
      console.log(error);
      throw new HttpException({ message: error }, 500);
    }
  }

  @Post('/enroll/careerpath/:careerpathId')
  async enrollInCareerPath(
    @Req() req: Request,
    @Param('careerpathId') courseId: string
  ) {
    try {
      const userId = req.headers.user_id as string;
      return await this.careerPathService.enrollinCareerpath(userId, courseId);
    } catch (error: unknown) {
      console.log(error);
      throw new HttpException({ message: error }, 500);
    }
  }

  @Get('/progress/:courseId')
  get(@Req() req: Request, @Param('courseId') courseId: string) {
    const userId = req.headers.user_id as string;
    return { progress: this.courseService.get(userId, courseId) };
  }

  @Patch('/progress/:courseId')
  update(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Body() dto: any
  ) {
    const userId = req.headers.user_id as string;
    this.courseService.update(userId, courseId, dto.progress);
    return { success: true };
  }

  @Get('/list/careerpath')
  async getAllCareerPaths() {
    try {
      return await this.careerPathService.listCareerPaths();
    } catch (error: unknown) {
      throw new HttpException(error, 500);
    }
  }

  @Get('/list/roadmap')
  async getAllRoadmaps() {
    try {
      return await this.roadMapService.listRoadmaps();
    } catch (error: unknown) {
      throw new HttpException(error, 500);
    }
  }
}

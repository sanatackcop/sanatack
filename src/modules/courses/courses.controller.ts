import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AllCourses, CourseDetails } from './dto';
import { Course } from './entities/courses.entity';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CoursesService){}

    @Get()
    async getAllCourses(): Promise<AllCourses[]>{
        return await this.courseService.AllCourses();
    }

    @Get(':id')
    async getCourseDetails(@Param('id') id: number): Promise<CourseDetails>{
        return await this.courseService.CourseDetails(id);
    }
    }



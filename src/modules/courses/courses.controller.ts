import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Courses, CourseDetails } from './dto';
import { Course } from './entities/courses.entity';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CoursesService){}

    @Get('/list')
    async getAllCourses(@Req() req): Promise<Courses[]>{
        try{
            return await this.courseService.courses();}
        catch(error){
            console.log(error);
        }
    }

    @Get('/:id')
    async getCourseDetails(@Param('id') id: number){
        try{
            return await this.courseService.courseDetails(id);}
        catch(error){
            console.log(error);
        }
    }

    }



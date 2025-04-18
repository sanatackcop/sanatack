import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/courses.entity';
import { CourseResponse } from '../admin/dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  async list(): Promise<CourseResponse[]> {
    const courses = await this.courseRepository.find();

    const res = courses.map((course) => {
      return {
        id: course.id,
        title: course.title.toUpperCase(),
        description: course.description?.substring(0, 100),
      };
    });

    return res;
  }

  async createNewCourse(){
    
  }
}

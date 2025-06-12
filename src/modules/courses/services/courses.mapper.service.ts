import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { CourseMapper } from '../entities/courses-maper.entity';
import { CoursesService } from './courses.service';
import LessonMapperService from './lesson.mapper';

@Injectable()
export default class CourseMapperService {
  constructor(
    @InjectRepository(CourseMapper)
    private readonly courseMapper: Repository<CourseMapper>,
    private readonly moduleMapper: LessonMapperService,
    private readonly courseService: CoursesService
  ) {}

  async create(map: DeepPartial<CourseMapper>) {
    const course = await this.courseService.findOne(map.course.id);
    const moduleEntity = await this.courseService.findModuleById(map.module.id);

    console.log({ map });
    if (!course || !moduleEntity) {
      throw new HttpException(
        `Invalid ${!course ? 'course' : 'module'} ID`,
        HttpStatus.BAD_REQUEST
      );
    }

    const courseMapper = this.courseMapper.create({
      course,
      module: moduleEntity,
      order: map.order,
    });
    await this.courseMapper.save(courseMapper);
    await this.addModuleToCourseProgress(map.course.id, map.module.id);
  }

  async addModuleToCourseProgress(course_id: string, module_id: string) {
    const course = await this.courseMapper.findOne({
      where: { course: { id: Equal(course_id) } },
      relations: { course: true },
    });
    if (!course)
      throw new HttpException('No Course Found', HttpStatus.NOT_FOUND);

    const getNewMaterialCount =
      await this.moduleMapper.getMaterialCount(module_id);

    const updatedCount = course.course.material_count + getNewMaterialCount;
    await this.courseService.update(course_id, {
      material_count: updatedCount,
    });
  }

  getAllLinkedByModules(course_id: string) {
    return this.courseMapper.find({
      where: { course: { id: Equal(course_id) } },
      relations: {
        module: true,
      },
    });
  }
}

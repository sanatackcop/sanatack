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
    await this.addModuleToCourse(map.course.id, map.module.id);
  }

  async addModuleToCourse(course_id: string, module_id: string) {
    const courseMapper = await this.courseMapper.findOne({
      where: { course: { id: Equal(course_id) } },
      relations: { course: true },
    });
    if (!courseMapper)
      throw new HttpException('No Course Found', HttpStatus.NOT_FOUND);

    const materialCountAndTotalduration =
      await this.moduleMapper.getMaterialsTotalDurationAndCount(module_id);

    const updatedCount =
      courseMapper.course.material_count + materialCountAndTotalduration.sum;

    const updatedDuration =
      (courseMapper.course.course_info.durationHours ?? 0) +
      materialCountAndTotalduration.totalDuration;

    await this.courseService.update(course_id, {
      material_count: updatedCount,
      course_info: {
        ...courseMapper.course.course_info,
        durationHours: updatedDuration,
      },
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

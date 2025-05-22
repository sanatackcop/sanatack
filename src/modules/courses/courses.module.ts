import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/courses.entity';
import { CourseMapper } from './entities/courses-maper.entity';
import { LessonMapper } from './entities/lessons-maper.entity';
import { Lesson } from './entities/lessons.entity';
import { Quiz } from './entities/quiz.entity';
import { Resource } from './entities/resource.entity';
import { VideoResource } from './entities/video-lessons.entity';
import { Module as ModuleEntity } from './entities/module.entity';
import { CourseProgress } from './entities/course-progress';
import { Enrollment } from './entities/enrollment';
import { MaterialMapper } from './entities/material-mapper';
import { CareerPath } from './entities/career-path.entity';
import { RoadMap } from './entities/roadmap.entity';
import { CareerPathMapper } from './entities/career-mapper.entity';
import { RoadmapMapper } from './entities/roadmap-mapper.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      ModuleEntity,
      CourseMapper,
      LessonMapper,
      Lesson,
      Resource,
      Quiz,
      VideoResource,
      CourseProgress,
      Enrollment,
      MaterialMapper,
      CareerPath,
      RoadMap,
      CareerPathMapper,
      RoadmapMapper
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './services/courses.service';
import { Course } from './entities/courses.entity';
import { CourseMapper } from './entities/courses-maper.entity';
import { LessonMapper } from './entities/lessons-maper.entity';
import { Lesson } from './entities/lessons.entity';
import { Quiz } from './entities/quiz.entity';
import { Resource } from './entities/resource.entity';
import { VideoResource } from './entities/video-lessons.entity';
import { Module as ModuleEntity } from './entities/module.entity';
import { Enrollment } from './entities/enrollment';
import { MaterialMapper } from './entities/material-mapper';
import { CareerPath } from './entities/career-path.entity';
import { RoadMap } from './entities/roadmap.entity';
import { CareerPathMapper } from './entities/career-mapper.entity';
import { RoadmapMapper } from './entities/roadmap-mapper.entity';
import { CareerEnrollment } from './entities/career-enrollment.entity';
import { RoadmapEnrollment } from './entities/roadmap-enrollment.entity';
import { User } from '../users/entities/user.entity';
import QuizService from './services/quiz.service';
import ResourceService from './services/resource.service';
import VideoService from './services/video.service';
import CareerPathService from './services/career.path.service';
import RoadMapService from './services/roadmap.service';
import CareerEnrollmentService from './services/career.enrollment.service';
import UsersModule from '../users/users.module';
import EnrollmentService from './services/enrollment.service';
import RoadMapEnrollmentService from './services/roadmap.enrollment.service';
import ModuleService from './services/module.service';
import LessonService from './services/lesson.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Course,
      ModuleEntity,
      CourseMapper,
      LessonMapper,
      Lesson,
      Resource,
      Quiz,
      VideoResource,
      Enrollment,
      MaterialMapper,
      CareerPath,
      RoadMap,
      CareerPathMapper,
      RoadmapMapper,
      CareerEnrollment,
      RoadmapEnrollment,
      User,
    ]),
  ],
  controllers: [CoursesController],
  providers: [
    CareerPathService,
    RoadMapService,
    CoursesService,
    QuizService,
    VideoService,
    ResourceService,
    CareerEnrollmentService,
    EnrollmentService,
    RoadMapEnrollmentService,
    ModuleService,
    LessonService,
  ],
  exports: [CareerPathService, RoadMapService, CoursesService],
})
export class CoursesModule {}

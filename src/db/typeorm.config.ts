import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { migrationFiles } from './migrations';
import { User } from 'src/modules/users/entities/user.entity';
import { Token } from 'src/modules/auth/entities/token.entity';
import { Course } from 'src/modules/courses/entities/courses.entity';
import { Module } from 'src/modules/courses/entities/module.entity';
import { CourseMapper } from 'src/modules/courses/entities/courses-maper.entity';
import { LessonMapper } from 'src/modules/courses/entities/lessons-maper.entity';
import { Lesson } from 'src/modules/courses/entities/lessons.entity';
import { Resource } from 'src/modules/courses/entities/resource.entity';
import { Quiz } from 'src/modules/courses/entities/quiz.entity';
import { VideoResource } from 'src/modules/courses/entities/video-lessons.entity';
import { Enrollment } from 'src/modules/courses/entities/enrollment';
import { MaterialMapper } from 'src/modules/courses/entities/material-mapper';
import { CareerPath } from 'src/modules/courses/entities/career-path.entity';
import { RoadMap } from 'src/modules/courses/entities/roadmap.entity';
import { CareerPathMapper } from 'src/modules/courses/entities/career-mapper.entity';
import { RoadmapMapper } from 'src/modules/courses/entities/roadmap-mapper.entity';
import { CareerEnrollment } from 'src/modules/courses/entities/career-enrollment.entity';
import { RoadmapEnrollment } from 'src/modules/courses/entities/roadmap-enrollment.entity';

config();

const configService = new ConfigService();
export const entities = [
  User,
  Token,
  Course,
  Module,
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
];

const mainDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('MAIN_DB_HOST') || 'localhost',
  port: Number(configService.get('MAIN_DB_PORT')) || 5432,
  username: configService.get('MAIN_DB_USERNAME'),
  password: configService.get('MAIN_DB_PASSWORD'),
  database: configService.get('MAIN_DB') || 'smg_db',
  entities: entities,
  logging: false,
  migrations: migrationFiles,
  migrationsRun: true,
  migrationsTableName: 'migrations',
});

export default mainDataSource;

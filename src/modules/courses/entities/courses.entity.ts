import { Entity, Column, OneToMany } from 'typeorm';
import { Level } from './dto';
import { CourseMapper } from './courses-maper.entity';
import { Enrollment } from './enrollment';
import { RoadmapMapper } from 'src/modules/courses/entities/roadmap-mapper.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity({ name: 'courses' })
export class Course extends AbstractEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text' })
  level: Level;

  @Column({ type: 'jsonb', nullable: true })
  tags?: {
    durtionsHours: number;
  };

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => CourseMapper, (mapper) => mapper.course)
  courseMappers: CourseMapper[];

  @OneToMany(() => Enrollment, (course) => course.course)
  enrollment: Enrollment[];

  @OneToMany(() => RoadmapMapper, (mapper) => mapper.course)
  roadmapMappers: RoadmapMapper[];
}

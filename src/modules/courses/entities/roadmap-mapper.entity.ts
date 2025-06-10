import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoadMap } from './roadmap.entity';
import { Course } from 'src/modules/courses/entities/courses.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity('roadmap_mapper')
export class RoadmapMapper extends AbstractEntity {
  @ManyToOne(() => RoadMap, (roadmap) => roadmap.roadmapMappers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roadmap_id' })
  roadmap: RoadMap;

  @ManyToOne(() => Course, (course) => course.roadmapMappers)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int' })
  order: number;
}

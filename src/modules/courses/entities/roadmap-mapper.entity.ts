import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoadMap } from './roadmap.entity';
import { Course } from 'src/modules/courses/entities/courses.entity';

@Entity('roadmap_mapper')
export class RoadmapMapper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;
}

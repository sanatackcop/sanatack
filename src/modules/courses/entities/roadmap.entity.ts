import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CareerPathMapper } from './career-mapper.entity';
import { RoadmapMapper } from './roadmap-mapper.entity';
import { RoadmapEnrollment } from './roadmap-enrollment.entity';

@Entity('roadmap')
export class RoadMap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => CareerPathMapper, (link) => link.roadmap)
  careerPathMappers: CareerPathMapper[];

  @OneToMany(() => RoadmapMapper, (mapper) => mapper.roadmap, { cascade: true })
  roadmapMappers: RoadmapMapper[];

  @OneToMany(() => RoadmapEnrollment, (mapper) => mapper.roadmap, {
    cascade: true,
  })
  roadmapEnrollments: RoadmapEnrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

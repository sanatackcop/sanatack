import { Column, Entity, OneToMany } from 'typeorm';
import { CareerPathMapper } from './career-mapper.entity';
import { RoadmapMapper } from './roadmap-mapper.entity';
import { RoadmapEnrollment } from './roadmap-enrollment.entity';
import AbstractEntity from './abstract.base.entity';

@Entity('roadmap')
export class RoadMap extends AbstractEntity {
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
}

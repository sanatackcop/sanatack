import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CareerPath } from './career-path.entity';
import { RoadMap } from './roadmap.entity';
import AbstractEntity from './abstract.base.entity';

@Entity('career_path_mapper')
export class CareerPathMapper extends AbstractEntity {
  @ManyToOne(() => CareerPath, (careerPath) => careerPath.roadmaps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'career_path_id' })
  careerPath: CareerPath;

  @ManyToOne(() => RoadMap, (roadmap) => roadmap.careerPathMappers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roadmap_id' })
  roadmap: RoadMap;

  @Column({ type: 'int' })
  order: number;
}

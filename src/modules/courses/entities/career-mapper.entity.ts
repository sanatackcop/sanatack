import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CareerPath } from './career-path.entity';
import { RoadMap } from './roadmap.entity';

@Entity('career_path_mapper')
export class CareerPathMapper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;
}

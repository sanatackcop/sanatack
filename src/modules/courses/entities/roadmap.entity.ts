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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

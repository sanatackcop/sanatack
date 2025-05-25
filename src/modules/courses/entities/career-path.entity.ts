import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CareerPathMapper } from './career-mapper.entity';
import { CareerEnrollment } from './career-enrollment.entity';

@Entity('career_path')
export class CareerPath {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => CareerPathMapper, (mapper) => mapper.careerPath)
  roadmaps: CareerPathMapper[];

  @OneToMany(() => CareerEnrollment, (mapper) => mapper.careerPath)
  careerpathEnrollments: CareerEnrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

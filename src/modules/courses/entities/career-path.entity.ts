import { Column, Entity, OneToMany } from 'typeorm';
import { CareerPathMapper } from './career-mapper.entity';
import { CareerEnrollment } from './career-enrollment.entity';
import AbstractEntity from '@libs/db/abstract.base.entity';

@Entity('career_path')
export class CareerPath extends AbstractEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => CareerPathMapper, (mapper) => mapper.careerPath)
  roadmaps: CareerPathMapper[];

  @OneToMany(() => CareerEnrollment, (mapper) => mapper.careerPath)
  careerpathEnrollments: CareerEnrollment[];
}

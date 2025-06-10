import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';
import { MaterialType } from './material-mapper';

@Entity({ name: 'resource' })
export class Resource extends AbstractEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, type: 'enum', enum: MaterialType })
  type: MaterialType;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  content: string;
}

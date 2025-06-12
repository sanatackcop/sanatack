import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';
import { MaterialType } from './material-mapper';

export declare type LinkResource = Resource & {
  order: number;
};

@Entity({ name: 'resource' })
export default class Resource extends AbstractEntity {
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

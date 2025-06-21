import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';
import { MaterialType } from './material-mapper';
import { Article } from './article.entity';

@Entity({ name: 'resource' })
export default class Resource extends AbstractEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column()
  duration: number;
}

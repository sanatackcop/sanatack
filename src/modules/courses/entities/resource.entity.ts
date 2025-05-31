import { Column, Entity } from 'typeorm';
import AbstractEntity from './abstract.base.entity';

@Entity({ name: 'resource' })
export class Resource extends AbstractEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  type: 'video' | 'document' | 'link' | 'code';

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  content: string;
}

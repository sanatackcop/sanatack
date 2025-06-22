import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';
import { MaterialType } from './material-mapper';

export declare type LinkVideo = Video & {
  order: number;
  type: MaterialType.VIDEO;
};

@Entity({ name: 'video' })
export default class Video extends AbstractEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  youtubeId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  duration: number;
}

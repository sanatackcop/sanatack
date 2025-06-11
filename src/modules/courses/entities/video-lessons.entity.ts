import { Column, Entity } from 'typeorm';
import AbstractEntity from '@libs/db/abstract.base.entity';

export declare type LinkVideo = VideoResource & {
  order: number;
};

@Entity({ name: 'video_resource' })
export default class VideoResource extends AbstractEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  youtubeId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  duration: number;
}

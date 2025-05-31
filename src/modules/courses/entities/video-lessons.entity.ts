import { Column, Entity } from 'typeorm';
import AbstractEntity from './abstract.base.entity';

@Entity({ name: 'video_resource' })
export class VideoResource extends AbstractEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  youtubeId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  duration: number;
}

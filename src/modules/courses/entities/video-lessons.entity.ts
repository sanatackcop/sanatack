import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'video_resource' })
export class VideoResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  youtubeId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @CreateDateColumn()
  createdAt: Date;
}

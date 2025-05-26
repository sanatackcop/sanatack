import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoadMap } from './roadmap.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({ name: 'roadmap_enrollment' })
export class RoadmapEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RoadMap, (roadmap) => roadmap.roadmapEnrollments, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'roadmap_id' })
  roadmap: RoadMap;

  @ManyToOne(() => User, (user) => user.roadmapEnrollments, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;
}

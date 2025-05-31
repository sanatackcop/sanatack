import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoadMap } from './roadmap.entity';
import { User } from 'src/modules/users/entities/user.entity';
import AbstractEntity from './abstract.base.entity';

@Entity({ name: 'roadmap_enrollment' })
export class RoadmapEnrollment extends AbstractEntity {
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

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;
}

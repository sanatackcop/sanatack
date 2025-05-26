import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CareerPath } from "./career-path.entity";
import { User } from "src/modules/users/entities/user.entity";

@Entity({ name: 'career_enrollment' })
export class CareerEnrollment{
    @PrimaryGeneratedColumn('uuid')
      id: string;
    
      @ManyToOne(() => CareerPath, (careerpath) => careerpath.careerpathEnrollments, {
        onDelete: 'SET NULL',
        nullable: false,
      })
      @JoinColumn({ name: 'careerpath_id' })
      careerPath: CareerPath;
    
      @ManyToOne(() => User, (user) => user.careerpathEnrollments, {
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
import AbstractEntity from '@libs/db/abstract.base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Attempts extends AbstractEntity {
  @Column()
  status: 'success' | 'failed';

  @Column()
  email: string;

  @Column()
  code: string;
}

import AbstractEntity from '@libs/db/abstract.base.entity';
import { Entity, Column, BeforeInsert } from 'typeorm';

@Entity()
export class Otps extends AbstractEntity {
  @Column()
  to: string;

  @Column()
  type: 'mobile' | 'email';

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'bigint' })
  expiration: number;

  @Column()
  code: string;

  @BeforeInsert()
  setCode() {
    if (this?.code != '000000') this.code = generateOTP();
    this.expiration = addMinutes();
  }
}

function addMinutes(): number {
  const date = new Date();
  return new Date(date.getTime() + 10 * 60000).getTime();
}

function generateOTP(): string {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

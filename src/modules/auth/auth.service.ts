import {
  BasicLoginBody,
  SendEmailOtpBody,
  SingupBody,
  SingupReturn,
} from './dto/auth.dto';
import UsersService from '../users/users.service';
import { TokenService } from './token.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    @InjectQueue('otpQueue') private otpQueue: Queue,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  async validateOAuthLogin(profile: any): Promise<any> {
    return profile;
  }

  async basicLogin({ email, password }: BasicLoginBody): Promise<
    | {
        user: string;
        refresh_token: string;
        role: string;
        type: string;
      }
    | { message: string }
  > {
    const userExists = await this.userService.getUser({ email });
    if (!userExists) {
      return { message: 'User Not Found' };
    }

    if (userExists.password !== password) {
      return { message: 'Incorrect password' };
    }

    const token = await this.tokenService.generateTokens(
      { ...userExists },
      userExists.id
    );
    return {
      user: token.accessToken,
      role: 'student',
      type: 'student-context',
      refresh_token: token.refreshToken,
    };
  }

  async basicSignup({
    email,
    password,
    first_name,
    last_name,
    phone,
  }: SingupBody): Promise<SingupReturn> {
    const userExists = await this.userService.getUser({ email });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.createUser({
      email,
      password,
      first_name,
      last_name,
      phone,
    });

    if (!newUser) {
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }

    const token = await this.tokenService.generateTokens(
      { ...newUser },
      newUser.id
    );

    return {
      user: token.accessToken,
      role: 'student',
      type: 'student-context',
      refresh_token: token.refreshToken,
    };
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendEmailOtp({
    user_id,
    email,
  }: SendEmailOtpBody): Promise<{ message: string }> {
    const otp = this.generateOTP();
    await this.redis.set(`otp:${user_id}`, otp, 'EX', 5 * 60 * 1000);

    await this.otpQueue.add(
      'sendEmailJob',
      { user_id, email, otp },
      {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 5,
        backoff: { type: 'exponential', delay: 1500 },
      }
    );

    return { message: 'OTP sent successfully.' };
  }

  async verifyOtp({
    user_id,
    otp,
  }: {
    user_id: string;
    otp: string;
  }): Promise<{ message: string; isVerify: boolean } | HttpException> {
    const storedOtp = await this.redis.get(`otp:${user_id}`);

    if (!storedOtp) {
      throw new HttpException('OTP expired or does not exist.', 404);
    }
    if (storedOtp !== otp) {
      throw new HttpException('Invalid OTP provided.', 401);
    }

    const isVerify = await this.userService.turnActive({ user_id });
    await this.redis.del(`otp:${user_id}`);
    return { message: 'OTP verified successfully.', isVerify };
  }
}

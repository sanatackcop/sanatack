import { BasicLoginBody, SignupBody, SingupReturn } from '../dto/auth.dto';
import UsersService from '../../users/users.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import OtpsService from './otp.service';
import { TokenService } from './token.service';
import UsersAttributesService from '../../users/users.attributes.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly usersAttributes: UsersAttributesService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpsService
  ) {}

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

    const token = await this.tokenService.generateTokens({ ...userExists });
    return {
      user: token.accessToken,
      role: 'student',
      type: 'student-context',
      refresh_token: token.refreshToken,
    };
  }

  async basicSignup(signup_data: SignupBody): Promise<SingupReturn> {
    const { personalInfo, interests, userType } = signup_data;

    const userExists = await this.userService.getUser({
      email: personalInfo.email,
    });
    if (userExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const newUser = await this.userService.createUser(personalInfo);

    const token = await this.tokenService.generateTokens({ ...newUser });

    await this.usersAttributes.create({
      userType: userType,
      topics: interests,
      user: { id: newUser.id },
    });

    return {
      user: token.accessToken,
      role: 'student',
      type: 'student-context',
      refresh_token: token.refreshToken,
    };
  }

  async sendOtp(email: string) {
    return await this.otpService.createTokenOtp(email);
  }

  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{ message: string } | HttpException> {
    await this.otpService.verifyOtp(email, otp);
    return { message: 'OTP verified successfully.' };
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import {
  BasicLoginBody,
  SendEmailOtpBody,
  SignupBody,
  VerifyOtpBody,
} from './dto/auth.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() body: BasicLoginBody) {
    try {
      const login = await this.authService.basicLogin({
        email: body.email,
        password: body.password,
      });
      return login;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/signup')
  async createAccount(@Body() body: SignupBody) {
    return await this.authService.basicSignup(body);
  }

  @Post('/send-email-otp')
  async sendEmailOtp(@Body() body: SendEmailOtpBody) {
    try {
      return await this.authService.sendOtp(body.email);
    } catch (error: unknown) {
      console.log({ err: error });
    }
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() body: VerifyOtpBody) {
    return await this.authService.verifyOtp(body.email, body.otp);
  }
}

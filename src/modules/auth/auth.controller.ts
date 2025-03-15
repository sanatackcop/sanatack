import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  BasicLoginBody,
  SendEmailOtpBody,
  SingupBody,
  SingupReturn,
  VerifyOtpBody,
} from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req) {
    return req.user;
  }

  @Post('/login')
  async login(@Req() req, @Body() body: BasicLoginBody) {
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

  @Post('/singup')
  async createAccount(@Req() req, @Body() body: SingupBody) {
    const singup: SingupReturn | { message: string } =
      await this.authService.basicSignup({
        ...body,
      });
    return singup;
  }

  @Post('/send-email-otp')
  async sendEmailOtp(@Req() req, @Body() body: SendEmailOtpBody) {
    try {
      const sendOtp: SingupReturn | { message: string } =
        await this.authService.sendEmailOtp({
          ...body,
        });
      return sendOtp;
    } catch (error) {
      console.log({ err: error });
    }
  }

  @Post('/verify-otp')
  async verifyOtp(@Req() req, @Body() body: VerifyOtpBody) {
    const sendOtp: SingupReturn | { message: string } =
      await this.authService.verifyOtp({
        user_id: body.user_id,
        otp: body.otp,
      });
    return sendOtp;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Equal, MoreThan, Repository } from 'typeorm';
import { Otps } from '../entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import AttemptsService from './attempts.service';
import NotificationsService, {
  EmailMessage,
} from './notificationService.service';

@Injectable()
export default class OtpsService {
  constructor(
    @InjectRepository(Otps)
    private readonly otpRepo: Repository<Otps>,
    private readonly attemptsService: AttemptsService,
    private readonly notificationsService: NotificationsService
  ) {}

  async verifyOtp(email: string, code: string) {
    const otp = await this.otpRepo.findOne({
      where: {
        to: Equal(email),
        code: Equal(code),
        expiration: MoreThan(new Date().getTime()),
        used: false,
      },
    });

    if (!otp) {
      await this.attemptsService.createFailedAttempt(email, code);
      throw new HttpException('Incorrect Otp', HttpStatus.BAD_REQUEST);
    } else {
      await this.otpRepo.update({ id: Equal(otp.id) }, { used: true });
      await this.attemptsService.createSuccessAttempt(email, code);
      return otp;
    }
  }

  async createTokenOtp(email: string) {
    const otp = await this.otpRepo.save(
      this.otpRepo.create({
        to: email,
        type: 'email',
      })
    );
    await this.notificationsService.send(this.tokenOtpTemplate(otp, email));
    return {
      message: 'otp send',
    };
  }

  private tokenOtpTemplate(otp: Otps, email: string): EmailMessage {
    return {
      to: email,
      subject: 'Your Sanatack Login Code',
      text: `Hello,\n\nYour one-time password (OTP) to access your Sanatack account is: ${otp.code}\n\nThis code is valid for a short time. If you didn’t request this login, please contact our support team immediately.\n\nThanks,\nSanatack Team`,
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d2d2d; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #4a90e2; text-align: center;">Welcome to Sanatack</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Your one-time password (OTP) to log into your Sanatack account is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #d9534f; text-align: center;">${otp.code}</p>
        <p style="font-size: 16px;">This code will expire shortly for security reasons. Please do not share it with anyone.</p>
        <p style="font-size: 16px;">If you did not initiate this login request, please contact our support team immediately.</p>
        <p style="font-size: 16px;">Thank you,<br><strong>The Sanatack Team</strong></p>
        <div style="margin-top: 20px; font-size: 14px; color: #888; text-align: center;">
          Empowering learners through secure and seamless access.
        </div>
      </div>
    </div>
  `,
      from: 'Sanatack <no-reply@sanatack.com>',
      from_client: true,
    };
  }
}

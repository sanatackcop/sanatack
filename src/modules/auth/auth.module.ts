import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import UsersModule from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otps } from './entities/otp.entity';
import { Attempts } from './entities/attempts.entity';
import { TokenService } from './services/token.service';
import OtpsService from './services/otp.service';
import AttemptsService from './services/attempts.service';
import NotificationsService from './services/notificationService.service';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    TypeOrmModule.forFeature([Otps, Attempts]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '30s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtAuthGuard,
    RolesGuard,
    OtpsService,
    AttemptsService,
    NotificationsService,
  ],
})
export class AuthModule {}

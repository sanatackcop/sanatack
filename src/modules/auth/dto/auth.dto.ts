import { IsEmail, IsNotEmpty, IsString, IsUUID, isUUID } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

export class BasicLoginBody {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SingupBody extends BasicLoginBody {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class SendEmailOtpBody extends BasicLoginBody {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class VerifyOtpBody {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id: string;
}

export type SingupReturn = {
  user: string;
  refresh_token: string;
  role: string;
  type: string;
};

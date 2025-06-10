import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UserType } from 'src/modules/users/entities/user.attributes.entity';

export class BasicLoginBody {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class PersonalInfoDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('SA')
  phone: string;
}

export class SignupBody {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @ApiProperty()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty()
  interests: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsEnum(UserType)
  userType: UserType;
}

export class SendEmailOtpBody {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class VerifyOtpBody {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export type SingupReturn = {
  user: string;
  refresh_token: string;
  role: string;
  type: string;
};

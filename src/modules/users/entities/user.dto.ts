import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber('SA')
  phone?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  organization?: string;
}

export class UserProfile{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerify: boolean;
  isPro: boolean;
  phone?: string;
  attributes?: {
    topics: string[];
    userType: string;
    bio?: string;
    organization?: string;
  };
  created_at: string;
}

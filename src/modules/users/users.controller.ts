import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Req,
} from '@nestjs/common';
import { UpdateProfileDto } from './entities/user.dto';
import UsersService from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    try {
      const userId = req.headers.user_id as string;
      return await this.userService.getUserProfile(userId);
    } catch (error: unknown) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfiledto: UpdateProfileDto
  ) {
    try {
      const userId = req.headers.user_id as string;
      return await this.userService.updateProfile(userId, updateProfiledto);
    } catch (error: unknown) {
      console.log({ error });
      throw new HttpException(error, 500);
    }
  }
}

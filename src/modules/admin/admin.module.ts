import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [ApiController],
  providers: [AdminService],
})
export class AdminModule {}

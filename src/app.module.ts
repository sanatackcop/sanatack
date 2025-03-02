import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AdminModule, UsersModule, CoursesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

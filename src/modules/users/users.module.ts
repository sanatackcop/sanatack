import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import UsersService from './users.service';
import { UsersController } from './users.controller';
import UsersAttributes from './entities/user.attributes.entity';
import UsersAttributesService from './users.attributes.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersAttributes])],
  controllers: [UsersController],
  providers: [UsersService, UsersAttributesService],
  exports: [UsersService, UsersAttributesService],
})
export default class UsersModule {}

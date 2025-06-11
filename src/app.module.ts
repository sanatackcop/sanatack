import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import UsersModule from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './db/typeorm.config';
import { migrationFiles } from './db/migrations';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('MAIN_DB_HOST', 'localhost'),
        port: configService.get<number>('MAIN_DB_PORT', 5432),
        username: configService.get<string>('MAIN_DB_USERNAME'),
        password: configService.get<string>('MAIN_DB_PASSWORD'),
        database: configService.get<string>('MAIN_DB'),
        entities: entities,
        ssl: configService.get<string>('MAIN_DB_SSL') === 'true',
        autoLoadEntities: true,
        retryAttempts: configService.get<number>('MAIN_RECONNECT_TIMES', 5),
        migrationsRun: true,
        migrationsTableName: 'migrations',
        migrations: migrationFiles,
      }),
    }),
    TypeOrmModule.forFeature(entities),
    AdminModule,
    UsersModule,
    CoursesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

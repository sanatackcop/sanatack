import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import UsersModule from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './db/typeorm.config';
import { migrationFiles } from './db/migrations';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      url: process.env.REDIS_URL,
      type: 'single',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        retryStrategy: () => +process.env.REDIS_RETRY_TIMES,
      },
    }),
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
        autoLoadEntities: true,
        // logging: configService.get<string>('NODE_ENV') === 'development',
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

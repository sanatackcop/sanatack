import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { migrationFiles } from './migrations';
import { User } from 'src/modules/users/entities/user.entity';
import { Token } from 'src/modules/auth/entities/token.entity';

config();

const configService = new ConfigService();
export const entities = [User, Token];

const mainDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('MAIN_DB_HOST') || 'localhost',
  port: Number(configService.get('MAIN_DB_PORT')) || 5432,
  username: configService.get('MAIN_DB_USERNAME'),
  password: configService.get('MAIN_DB_PASSWORD'),
  database: configService.get('MAIN_DB') || 'smg_db',
  entities: entities,
  logging: configService.get('NODE_ENV') === 'development',
  migrations: migrationFiles,
  migrationsRun: true,
  migrationsTableName: 'migrations',
});

export default mainDataSource;

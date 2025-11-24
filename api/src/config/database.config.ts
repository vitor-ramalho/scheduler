import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgres://scheduler:scheduler@localhost:5432/scheduler_db';

  return {
    type: 'postgres',
    url: connectionString,
    synchronize: false, // NEVER use synchronize - always use migrations
    logging: process.env.NODE_ENV === 'development',
    retryAttempts: 10,
    retryDelay: 3000,
    autoLoadEntities: true,
    migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
    migrationsRun: false, // Migrations are run manually in main.ts before app starts
  };
});

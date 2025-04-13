import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import databaseConfig from '../src/config/database.config';

describe('Database Config', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: {
            folder: './config',
          },
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should load the database configuration', () => {
    const config = databaseConfig();
    expect(config).toBeDefined();
  });

  it('should have the correct database type', () => {
    const config = databaseConfig();
    expect(config.type).toBe('postgres');
  });

  it('should have the correct host', () => {
    const config = databaseConfig();
    expect(config.host).toBe(process.env.DB_HOST || 'localhost');
  });

  it('should have the correct port', () => {
    const config = databaseConfig();
    expect(config.port).toBe(parseInt(process.env.DB_PORT, 10) || 5432);
  });

  it('should have the correct username', () => {
    const config = databaseConfig();
    expect(config.username).toBe(process.env.DB_USERNAME || 'postgres');
  });

  it('should have the correct password', () => {
    const config = databaseConfig();
    expect(config.password).toBe(process.env.DB_PASSWORD || 'postgres');
  });

  it('should have the correct database name', () => {
    const config = databaseConfig();
    expect(config.database).toBe(process.env.DB_NAME || 'postgres');
  });

  it('should have the correct synchronization setting', () => {
    const config = databaseConfig();
    expect(config.synchronize).toBe(false);
  });

  it('should have the correct autoLoadEntities setting', () => {
    const config = databaseConfig();
    expect(config.autoLoadEntities).toBe(true);
  });
});
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import appConfig from '../src/config/app.config';

describe('AppConfig', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: {
            // Mock configuration values here if needed for testing
          },
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should load the app configuration correctly', () => {
    const config = appConfig();
    expect(config).toBeDefined();
    // Add assertions to check specific configuration values
    // For example:
    // expect(config.port).toEqual(3000); 
    // expect(config.environment).toEqual('development');
  });

  it('should access configuration values through ConfigService', () => {
    // Mock process.env values for testing
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'test';

    const module = Test.createTestingModule({
        providers: [ConfigService],
      }).compile();
    
    const configService = module.get(ConfigService);
    expect(configService.get('port')).toBe(4000);
    expect(configService.get('node_env')).toBe('test');
  });

});
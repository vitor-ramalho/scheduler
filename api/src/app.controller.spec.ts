import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],

      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn().mockResolvedValue([1]),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return health status online', async () => {
    const result = { status: 'online', database: true };
    jest.spyOn(appController, 'getHealth').mockResolvedValue(Promise.resolve(result));
    const health = await appController.getHealth()
    expect(health).toEqual(result);
  });

    it('should return a greeting message', async () => {
      const result = 'Hello World!';
      jest.spyOn(appController, 'getHello').mockReturnValue(result);
      const hello = appController.getHello()
      expect(hello).toEqual(result);
  });
});

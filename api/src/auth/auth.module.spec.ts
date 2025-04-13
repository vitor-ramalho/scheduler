import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { AuthController } from '../src/auth/auth.controller';
import { UsersModule } from '../src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../src/auth/strategies/jwt-refresh.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from '../src/auth/strategies/local.strategy';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_ACCESS_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN') },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        JwtRefreshStrategy,
        LocalStrategy
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AuthService defined', () => {
    expect(module.get<AuthService>(AuthService)).toBeDefined();
  });

  it('should have AuthController defined', () => {
    expect(module.get<AuthController>(AuthController)).toBeDefined();
  });

  it('should have JwtStrategy defined', () => {
    expect(module.get<JwtStrategy>(JwtStrategy)).toBeDefined();
  });

  it('should have JwtRefreshStrategy defined', () => {
    expect(module.get<JwtRefreshStrategy>(JwtRefreshStrategy)).toBeDefined();
  });
});
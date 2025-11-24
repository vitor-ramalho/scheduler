import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Run migrations before starting the app
    logger.log('Running database migrations...');
    const dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: false,
    });

    await dataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.destroy();
    logger.log('Migrations completed successfully!');

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new DatabaseExceptionFilter());
    app.enableCors();

    // Setup Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Scheduler SaaS API')
      .setDescription('API documentation for the Scheduler SaaS application')
      .setVersion('1.0')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('organizations', 'Organization management endpoints')
      .addTag('health', 'Health check endpoints')
      .addBearerAuth() // Add this line to enable bearer token authentication
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.log(
      `Swagger documentation available at: ${await app.getUrl()}/api/docs`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : '';
    logger.error(`Error starting application: ${message}`, stack);
    process.exit(1);
  }
}

void bootstrap();

import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { seedPlans } from './plan.seed';

async function bootstrap() {
  const logger = new Logger('Seed');
  
  try {
    logger.log('Starting seeding process...');
    
    // Create a standalone NestJS application
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get the data source from the application
    const dataSource = app.get(DataSource);
    
    // Seed the database in order
    await seedPlans(dataSource);
    
    // Add more seed functions here as needed
    
    logger.log('Seeding completed successfully');
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();

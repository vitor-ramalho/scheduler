import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

async function testDatabaseConnection() {
  const logger = new Logger('Database Test');
  
  try {
    // Create a standalone application context
    logger.log('Creating application context...');
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get the ConfigService
    const configService = app.get(ConfigService);
    
    // Log database connection string (masked for security)
    const dbUrl = configService.get<string>('database.url') || 'Not found';
    const maskedUrl = dbUrl.replace(/\/\/(.+?):(.+?)@/, '//***:***@');
    logger.log(`Database URL (masked): ${maskedUrl}`);
    
    // Get the DataSource
    const dataSource = app.get(getDataSourceToken());
    
    // Test if connection is active
    if (dataSource.isInitialized) {
      logger.log('Database connection is SUCCESSFUL!');
      
      // Run a simple query to further verify
      try {
        const result = await dataSource.query('SELECT NOW()');
        logger.log(`Database query successful. Current time from DB: ${result[0].now}`);
      } catch (queryError) {
        logger.error(`Database query failed: ${queryError.message}`);
      }
    } else {
      logger.error('Database connection is NOT initialized!');
    }
    
    // Clean up
    await app.close();
    logger.log('Test completed.');
  } catch (error) {
    logger.error(`Error testing database connection: ${error.message}`);
    if (error.stack) {
      logger.debug(error.stack);
    }
  }
}

// Run the test
testDatabaseConnection();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AbacatePayProvider } from './providers/abacate-pay.provider';
import { ConfigService } from '@nestjs/config';

async function testAbacatePayProvider() {
  console.log('Testing AbacatePay provider configuration...');
  
  try {
    // Create a standalone application context
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get the ConfigService
    const configService = app.get(ConfigService);
    
    // Log the environment variables we're interested in
    console.log('Environment variables:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Direct access to ABACATE_PAY_SECRET_KEY:', process.env.ABACATE_PAY_SECRET_KEY);
    console.log('ConfigService get ABACATE_PAY_SECRET_KEY:', configService.get('ABACATE_PAY_SECRET_KEY'));
    console.log('ConfigService get app.payment.abacatePay.secretKey:', 
      configService.get('app.payment.abacatePay.secretKey'));
    
    // Create an instance of the AbacatePayProvider
    const abacatePayProvider = new AbacatePayProvider(configService);
    
    console.log('AbacatePayProvider initialized successfully!');
    console.log('Headers:', abacatePayProvider['headers']);
    
    // Clean up
    await app.close();
  } catch (error) {
    console.error('Error testing AbacatePay provider:', error.message);
  }
}

// Run the test
testAbacatePayProvider();

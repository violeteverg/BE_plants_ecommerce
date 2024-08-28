import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set CORS configuration
  app.enableCors({
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Authentication',
      'Refresh',
    ],
    origin: 'https://plants-ecommerce.vercel.app',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  });

  // Apply cookie parser middleware
  app.use(cookieParser());

  // Apply validation pipe globally
  app.useGlobalPipes(new ValidationPipe());

  // Start the application
  await app.listen(3007);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: ['http://localhost:3004', 'https://plants-ecommerce.vercel.app'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3007);
}
bootstrap();

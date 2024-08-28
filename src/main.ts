import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: 'content-type',
    origin: [
      'https://plants-ecommerce.vercel.app/',
      'https://plants-ecommerce-3r3simab2-violetevergs-projects.vercel.app/',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3007);
}
bootstrap();

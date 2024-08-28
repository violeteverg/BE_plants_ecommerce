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
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authentication, Refresh, Access-control-allow-credentials, Access-control-allow-headers, Access-control-allow-methods, Access-control-allow-origin, User-Agent, Referer, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Cache-Control, Pragma',
    origin: ['http://localhost:3004', 'https://plants-ecommerce.vercel.app'],
    credentials: true,
    methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3007);
}
bootstrap();

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controllers/auth.controllers';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/services/auth.service';
// import { UserService } from 'src/services/user.service';
// import { JwtConfig } from "src/jwt.config";
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { LocalStrategy } from 'src/local.stategy';
import { UserModule } from './user.module';
import { JwtStrategy } from 'src/jwt.strategy';

dotenv.config();

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_TOKEN,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

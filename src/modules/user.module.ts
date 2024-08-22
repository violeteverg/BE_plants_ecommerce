import { Module } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AuthService } from 'src/services/auth.service';
import { UserController } from 'src/controllers/user.controllers';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/services/user.service';

@Module({
  controllers: [UserController,],
  providers: [PrismaService,UserService],
  exports:[UserService],
})
export class UserModule {}

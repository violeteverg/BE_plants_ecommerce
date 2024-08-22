import { Module } from '@nestjs/common';
import { OrdertController } from 'src/controllers/order.controllers';
import { ResponseHelper } from 'src/helpers/responseHelper';
import { JwtStrategy } from 'src/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from 'src/services/order.service';

@Module({
  controllers: [OrdertController],
  providers: [OrderService, PrismaService, JwtStrategy, ResponseHelper],
})
export class OrderModule {}

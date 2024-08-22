import { Module } from '@nestjs/common';
import { CartController } from 'src/controllers/cart.controllers';
import { ResponseHelper } from 'src/helpers/responseHelper';
import { JwtStrategy } from 'src/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/services/cart.service';
import { ProductService } from 'src/services/product.service';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    PrismaService,
    ProductService,
    JwtStrategy,
    ResponseHelper,
  ],
})
export class CartModule {}

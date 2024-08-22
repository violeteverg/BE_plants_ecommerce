import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryModule } from './category.module';
import { DiscountModule } from './discount.module';
import { ProductModule } from './product.module';
import { ResponseHelper } from 'src/helpers/responseHelper';
import { CartModule } from './cart.module';
import { MidtransModule } from './midtrans.module';
import { OrderModule } from './order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    DiscountModule,
    ProductModule,
    CartModule,
    MidtransModule,
    OrderModule,
  ],
  controllers: [],
  providers: [ResponseHelper],
})
export class AppModule {}

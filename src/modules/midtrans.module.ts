import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MidtransController } from 'src/controllers/midtrans.controllers';
import { MidtransService } from 'src/services/midtrans.service';
import { OrderService } from 'src/services/order.service';
import { ProductService } from 'src/services/product.service';

@Module({
  imports: [HttpModule],
  controllers: [MidtransController],
  providers: [MidtransService, ProductService, OrderService],
})
export class MidtransModule {}

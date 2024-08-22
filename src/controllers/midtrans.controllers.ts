import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MidtransCallbackDto } from 'src/dto/midtrans/midtrans.dto';
import { CreateTransactionDto } from 'src/dto/transactions/transactions.dto';
import { JwtAuthGuard } from 'src/jwt.guard';
import { MidtransService } from 'src/services/midtrans.service';
import { OrderService } from 'src/services/order.service';

@Controller('midtrans')
export class MidtransController {
  constructor(
    private readonly midtransService: MidtransService,
    private readonly orderService: OrderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('transaction')
  async createTransaction(
    @Body() transactionsDto: CreateTransactionDto,
    @Request() req: { user: { userId: number; iat: number; exp: number } },
  ) {
    const userId = req.user.userId;
    const { products, amount } = transactionsDto;
    return await this.midtransService.createTransaction(
      amount,
      products,
      userId,
    );
  }

  @Post('notif')
  async handlePaymentCallback(@Body() callbackData: MidtransCallbackDto) {
    console.log('Received payment callback:', callbackData);
    await this.orderService.updateOrder(callbackData);
    return { status: 'success' };
  }

  @Get('verify/:orderId')
  async verifyTransaction(@Param('orderId') orderId: string) {
    return await this.midtransService.verifyTransaction(orderId);
  }
}

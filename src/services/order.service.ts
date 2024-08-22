import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify } from 'jose';
import { MidtransCallbackDto } from 'src/dto/midtrans/midtrans.dto';
import { CreateOrderDto } from 'src/dto/order/order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  public async decodeToken(token: string) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_TOKEN),
      );
      return payload.userId as number;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private verifySignatureKey(
    signatureKey: string,
    orderId: string,
    statusCode: string,
    grossAmount: string,
  ): boolean {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const payload = orderId + statusCode + grossAmount + serverKey;

    // Hash the payload using SHA512
    const calculatedSignatureKey = crypto
      .createHash('sha512')
      .update(payload)
      .digest('hex');

    return calculatedSignatureKey === signatureKey;
  }

  //create order
  async createOrder(
    userId: number,
    order_id: string,
    createOrder: CreateOrderDto,
  ) {
    const { totalAmount, orderItems } = createOrder;

    const order = await this.prisma.order.create({
      data: {
        id: order_id,
        userId,
        orderDate: new Date(),
        orderStatus: 'pending',
        totalAmount,
        vaNumber: null,
        paymentType: null,
        bank: null,
        OrderItem: {
          createMany: {
            data: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      },
      include: { OrderItem: true },
    });

    return order;
  }
  //update status order
  async updateOrder(callback: MidtransCallbackDto) {
    const isValidSignatureKey = this.verifySignatureKey(
      callback.signature_key,
      callback.order_id,
      callback.status_code,
      callback.gross_amount,
    );
    console.log(isValidSignatureKey);

    if (!isValidSignatureKey) {
      throw new BadRequestException('invalid signature key');
    }

    await this.prisma.order.update({
      where: { id: callback.order_id },
      data: {
        orderStatus: callback.transaction_status,
        vaNumber: callback.va_numbers[0]?.va_number,
        paymentType: callback.payment_type,
        bank: callback.va_numbers[0]?.bank,
      },
    });
  }
  //get orderd
  async getAllOrder(userId: number) {
    return await this.prisma.order.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
      include: {
        OrderItem: true,
      },
    });
  }
}

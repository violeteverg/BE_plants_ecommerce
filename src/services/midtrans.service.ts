import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Snap, CoreApi } from 'midtrans-client';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ProductService } from './product.service';
import { generateRandomString } from 'src/utils/functions/generateRandomChar';
import { OrderService } from './order.service';

@Injectable()
export class MidtransService {
  private snap: Snap;
  private coreApi: CoreApi;

  constructor(
    private readonly httpService: HttpService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {
    this.snap = new Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    this.coreApi = new CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  async createTransaction(
    amount: number,
    products: { productId: number; quantity: number; price: number }[],
    userId: number,
  ) {
    const randomChar1 = generateRandomString(5);
    const randomChar2 = generateRandomString(5);
    const order_id = `TpLnts-${randomChar1}-${randomChar2}`;
    const parameter = {
      transaction_details: {
        order_id,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: 'http://localhost:3004/order',
        unfinish: 'http://localhost:3004/plants',
        error: 'http://localhost:3004/pots',
        cancel: 'http://localhost:3004/succulents',
      },
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);
      console.log('midtrans service:', products);

      await this.productService.reduceMultitpleProductQuantity(products);
      await this.orderService.createOrder(userId, order_id, {
        totalAmount: amount,
        orderItems: products,
      });
      //create order history ---

      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async verifyTransaction(orderId: string) {
    const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;
    const headers = {
      Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
      Accept: 'application/json',
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );
      console.log('>>>>>>><', response.data);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error verifying transaction: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import {
  Controller,
  Get,
  HttpStatus,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from 'src/services/order.service';
import { Response } from 'express';

import { ResponseHelper } from 'src/helpers/responseHelper';
import { JwtAuthGuard } from 'src/jwt.guard';

@Controller('order')
export class OrdertController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  // get order
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() req: { user: { userId: number; iat: number; exp: number } },
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const order = await this.orderService.getAllOrder(userId);

      return this.responseHelper.responseSuccessData(
        res,
        HttpStatus.OK,
        'Order retrieved successfully',
        order,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }
}

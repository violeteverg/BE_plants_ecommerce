import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CartService } from 'src/services/cart.service';
import { CreatedCartDto } from 'src/dto/cart/cart.dto';
import { UpdateCartDto } from 'src/dto/cart/updateCart.dto';
import { Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { ResponseHelper } from 'src/helpers/responseHelper';

@Controller('cart')
export class CartController {
  private readonly JWT_SECRET = process.env.JWT_SECRET_TOKEN;

  constructor(
    private readonly cartService: CartService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  private async decodeToken(token: string): Promise<number> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(this.JWT_SECRET),
      );
      return payload.userId as number;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getTokenFromCookies(req: Request): string {
    const token = req.cookies['Authentication'];
    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }
    return token;
  }

  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createdCartDto: CreatedCartDto,
  ) {
    try {
      const token = this.getTokenFromCookies(req);

      const cart = await this.cartService.createCart(token, createdCartDto);
      return this.responseHelper.responseSuccessData(
        res,
        HttpStatus.CREATED,
        'Cart created successfully',
        cart,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const token = this.getTokenFromCookies(req);
      const userId = await this.decodeToken(token);
      const carts = await this.cartService.findAll(userId);

      return this.responseHelper.responseSuccessData(
        res,
        HttpStatus.OK,
        'Cart retrieved successfully',
        carts,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    try {
      const token = this.getTokenFromCookies(req);
      const userId = await this.decodeToken(token);
      const cart = await this.cartService.update(userId, +id, updateCartDto);
      return this.responseHelper.responseSuccessData(
        res,
        HttpStatus.OK,
        `cart with ${id} already updated`,
        cart,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    try {
      const token = this.getTokenFromCookies(req);
      const userId = await this.decodeToken(token);
      await this.cartService.remove(userId, +id);
      return this.responseHelper.responseSuccess(
        res,
        HttpStatus.OK,
        `id ${id} removed already`,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }
}

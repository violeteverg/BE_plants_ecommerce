import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from './product.service';
import { CreatedCartDto } from 'src/dto/cart/cart.dto';
import { UpdateCartDto } from 'src/dto/cart/updateCart.dto';
import { jwtVerify } from 'jose';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  // Make decodeToken
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

  async createCart(token: string, createdCartDto: CreatedCartDto) {
    const { productId, quantity } = createdCartDto;

    const userId = await this.decodeToken(token);

    const product = await this.productService.findOne(productId);
    if (product.quantity < quantity) {
      throw new NotFoundException(
        `Product with ID ${productId} does not have enough quantity`,
      );
    }

    const existingCart = await this.prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (existingCart) {
      const newQuantity = existingCart.quantity + quantity;

      if (product.quantity < newQuantity) {
        throw new NotFoundException(
          `Product with ID ${productId} does not have enough quantity lol`,
        );
      }
      // await this.productService.updateQuantity(
      //   productId,
      //   product.quantity - quantity,
      // );

      return await this.prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: newQuantity },
      });
    } else {
      // await this.productService.updateQuantity(
      //   productId,
      //   product.quantity - quantity,
      // );
      return await this.prisma.cart.create({
        data: { ...createdCartDto, userId },
      });
    }
  }

  async findAll(userId: number) {
    return await this.prisma.cart.findMany({
      where: { userId },
      orderBy: {
        id: 'asc',
      },
      include: {
        product: true,
      },
    });
  }

  // async totalPrice(userId: number) {
  //   const carts = await this.prisma.cart.findMany({
  //     where: { userId },
  //     include: { product: true },
  //   });

  //   if (carts.length === 0) {
  //     return { totalQuantity: 0, totalPrice: 0 };
  //   }

  //   const { totalQuantity, totalPrice } = carts.reduce(
  //     (acc, cart) => {
  //       acc.totalQuantity += cart.quantity;
  //       acc.totalPrice += cart.quantity * cart.product.price;
  //       return acc;
  //     },
  //     { totalQuantity: 0, totalPrice: 0 },
  //   );

  //   return { totalQuantity, totalPrice };
  // }

  async update(userId: number, id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.prisma.cart.findUnique({ where: { id } });

    if (updateCartDto.quantity && cart.quantity !== updateCartDto.quantity) {
      const product = await this.productService.findOne(cart.productId);
      const quantity = updateCartDto.quantity - cart.quantity;

      if (product.quantity < quantity) {
        throw new NotFoundException(
          `Product with ID ${cart.productId} does not have enough quantity`,
        );
      }

      // await this.productService.updateQuantity(
      //   cart.productId,
      //   product.quantity - quantity,
      // );
    }
    return await this.prisma.cart.update({
      where: { id },
      data: updateCartDto,
    });
  }

  async remove(userId: number, id: number) {
    const cart = await this.prisma.cart.findUnique({ where: { id } });
    if (!cart || cart.userId !== userId) {
      throw new NotFoundException(
        `Cart with ID ${id} does not belong to the user`,
      );
    }
    const product = await this.productService.findOne(cart.productId);
    await this.productService.updateQuantity(
      cart.productId,
      product.quantity + cart.quantity,
    );
    return await this.prisma.cart.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from 'src/dto/discount/discount.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiscountService {
  constructor(private readonly prisma: PrismaService) {}

  //get all discount
  async findAll() {
    return await this.prisma.discount.findMany();
  }

  //create discount
  async createDiscount(createDiscountDto: CreateDiscountDto) {
    return await this.prisma.discount.create({ data: createDiscountDto });
  }
}

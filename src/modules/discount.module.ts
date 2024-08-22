import { Module } from '@nestjs/common';
import { DiscountController } from 'src/controllers/discount.controllers';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountService } from 'src/services/discount.service';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService, PrismaService],
})
export class DiscountModule {}

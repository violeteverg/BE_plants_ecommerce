import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDiscountDto } from 'src/dto/discount/discount.dto';
import { DiscountService } from 'src/services/discount.service';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  //get
  @Get()
  findAll() {
    return this.discountService.findAll();
  }
  //create
  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.createDiscount(createDiscountDto);
  }
}

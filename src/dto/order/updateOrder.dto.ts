import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './order.dto';

export class updateOrdertDto extends PartialType(CreateOrderDto) {}

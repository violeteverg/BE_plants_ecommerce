import { PartialType } from '@nestjs/mapped-types';
import { CreatedCartDto } from './cart.dto';

export class UpdateCartDto extends PartialType(CreatedCartDto) {}

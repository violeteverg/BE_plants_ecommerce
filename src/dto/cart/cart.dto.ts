import { IsNotEmpty } from 'class-validator';

export class CreatedCartDto {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  categoryId: any;

  @IsOptional()
  discountId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  latinName: string;

  image: any;

  @IsString()
  description: string;

  @IsNotEmpty()
  price: any;

  @IsNotEmpty()
  quantity: any;
}

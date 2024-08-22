import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  expiredDate: string;

  @IsNotEmpty()
  @IsBoolean()
  isExpired: boolean;
}

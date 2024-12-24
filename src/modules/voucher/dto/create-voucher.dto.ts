import { IsNotEmpty } from 'class-validator';

export class CreateVoucherDto {
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  discountAmount: number;
  @IsNotEmpty()
  discountType: string;
  @IsNotEmpty()
  startDate: Date;
  @IsNotEmpty()
  expiryDate: Date;
  @IsNotEmpty()
  usageLimit: number;
  @IsNotEmpty()
  score: number;
}

import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentMomoDto {
  orderIdUI: string;
  amount: string;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
}

export class SuccessMoMoDto {
  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;
}

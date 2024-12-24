import { IsNotEmpty } from 'class-validator';
import { Voucher } from 'src/entities/Voucher';

export class CreateUserVoucherDto {
  @IsNotEmpty()
  voucher: Voucher;
  @IsNotEmpty()
  quantity: number;
}

import { IsNotEmpty } from 'class-validator';

export class CreateQrcodeDto {
  @IsNotEmpty()
  qrData: string;
}

import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserPointDto {
  @IsNotEmpty()
  points: number;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  transactionType: string;
  @IsOptional()
  qrId?: string;
}

import { IsNotEmpty } from 'class-validator';

export class CreateSeatDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  seatNumber: string;
  @IsNotEmpty()
  isVip: boolean;
  @IsNotEmpty()
  hallId: number;
}

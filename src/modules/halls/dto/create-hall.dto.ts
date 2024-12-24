import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNotIn, IsNumber } from 'class-validator';

export class CreateHallDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  seatCount: number;
  @IsNotEmpty()
  diagram: string;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  cinemaId: number;
}

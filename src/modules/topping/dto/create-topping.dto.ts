import { IsNotEmpty } from 'class-validator';

export class CreateToppingDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  description: string;
}

import { IsNotEmpty } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  name: string;
}

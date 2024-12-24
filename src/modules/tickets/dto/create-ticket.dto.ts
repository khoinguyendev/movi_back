import { IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  showtimeId: number;
  @IsNotEmpty()
  tickets: any[];
  @IsNotEmpty()
  price: number;
}

export class FilterTicketDto {
  @IsNotEmpty()
  showtimeId: number;
}

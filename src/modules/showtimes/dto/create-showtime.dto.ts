import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShowtimeDto {}

export class FillterSTDTO {
  @IsNumber()
  @IsOptional()
  movieid: number; // Field to sort by
  @IsString()
  @IsOptional()
  sortField: string; // Field to sort by
  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Sort order must be either ASC or DESC' })
  sortOrder: 'ASC' | 'DESC'; // Sorting order
  @IsString()
  @IsOptional()
  searchField: string; // Field to search by
  @IsString()
  @IsOptional()
  searchValue: string; // Value to search for
}

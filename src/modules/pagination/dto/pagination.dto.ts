import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
} from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number;

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

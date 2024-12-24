import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCinemaDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  location: string;
  @IsNotEmpty()
  map: string;
  @IsNotEmpty()
  areaId: number;
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  longitude: number;
}

export class ShowTimeCinemaDto {
  @IsNotEmpty()
  movieId: number;
  @IsNotEmpty()
  date: Date;
  @IsNotEmpty()
  location: number;
  @IsNotEmpty()
  brandId: number;
}

export class FilterCinemaDto {
  @IsOptional()
  areaId?: number;
  @IsOptional()
  limit?: number;
  @IsOptional()
  page?: number;
}

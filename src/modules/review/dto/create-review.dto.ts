import { IsNotEmpty, IsOptional } from 'class-validator';
import { filter } from 'rxjs';

export class CreateReviewDto {
  @IsNotEmpty()
  movieId: number;
  @IsOptional()
  content: string;
  @IsOptional()
  images: string;
  @IsNotEmpty()
  rating: number;
}

export class FilterReviewDto {
  @IsOptional()
  movieId?: number;
  @IsOptional()
  minScore?: number;
  @IsOptional()
  maxScore?: number;
  @IsOptional()
  isPublic?: number;
}

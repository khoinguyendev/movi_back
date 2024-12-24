import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, FilterReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public } from 'src/decorator/customize';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.user.id, createReviewDto);
  }

  @Post('/filter')
  findAllFilter(@Body() filterReviewDto: FilterReviewDto) {
    return this.reviewService.findAllFilter(filterReviewDto);
  }
  @Post('/duyet/:id')
  duyet(@Param('id') id: number) {
    return this.reviewService.duyet(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewService.remove(+id);
  }
  @Public()
  @Post('/by-movie')
  findByMovie(@Body('movieId') movieId: number) {
    return this.reviewService.findByMovie(movieId);
  }
}

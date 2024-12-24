import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from 'src/decorator/customize';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Public()
  @Post()
  create(@Body('data') createMovieDto: CreateMovieDto[]) {
    return this.moviesService.create(createMovieDto);
  }
  @Public()
  @Get('top-selling')
  async getTopSellingMovies(@Query('limit') limit: number) {
    return this.moviesService.getTopMoviesWithMostTickets(limit || 5);
  }
  @Public()
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }
  @Public()
  @Get('/status/:status')
  findAllFilter(@Param('status') status: string) {
    return this.moviesService.findAllFilter(status);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
  @Public()
  @Post('/search')
  search(@Body('title') title: string) {
    return this.moviesService.search(title);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import {
  CreateCinemaDto,
  FilterCinemaDto,
  ShowTimeCinemaDto,
} from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { Public } from 'src/decorator/customize';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto);
  }
  @Public()
  @Get()
  findAll() {
    return this.cinemasService.findAll();
  }

  @Public()
  @Post('/getfilter')
  findAllFilter(@Body() filterCinemaDto: FilterCinemaDto) {
    return this.cinemasService.findAllFilter(filterCinemaDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCinemaDto: UpdateCinemaDto) {
    return this.cinemasService.update(+id, updateCinemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(+id);
  }
  @Public()
  @Post('showtimes/today')
  async getShowtimesToday(@Body() showTimeCinemaDto: ShowTimeCinemaDto) {
    return this.cinemasService.getShowtimesToday(showTimeCinemaDto);
  }
}

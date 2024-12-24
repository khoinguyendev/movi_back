import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto, FillterSTDTO } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Public } from 'src/decorator/customize';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }
  @Public()
  @Get()
  findAll() {
    return this.showtimesService.findAll();
  }
  @Public()
  @Get('/find-by-movie')
  findByMovie(@Body() fillterSTDTO: FillterSTDTO) {
    return this.showtimesService.findByMovie(fillterSTDTO);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimesService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(+id);
  }
}

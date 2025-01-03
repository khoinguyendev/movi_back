import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HallsService } from './halls.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Public } from 'src/decorator/customize';

@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Public()
  @Post()
  create(@Body() createHallDto: CreateHallDto) {
    return this.hallsService.create(createHallDto);
  }
  @Public()
  @Get()
  findAll() {
    return this.hallsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hallsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHallDto: UpdateHallDto) {
    return this.hallsService.update(+id, updateHallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hallsService.remove(+id);
  }
}

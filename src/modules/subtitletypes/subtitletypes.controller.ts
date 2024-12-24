import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubtitletypesService } from './subtitletypes.service';
import { CreateSubtitletypeDto } from './dto/create-subtitletype.dto';
import { UpdateSubtitletypeDto } from './dto/update-subtitletype.dto';

@Controller('subtitletypes')
export class SubtitletypesController {
  constructor(private readonly subtitletypesService: SubtitletypesService) {}

  @Post()
  create(@Body() createSubtitletypeDto: CreateSubtitletypeDto) {
    return this.subtitletypesService.create(createSubtitletypeDto);
  }

  @Get()
  findAll() {
    return this.subtitletypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subtitletypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubtitletypeDto: UpdateSubtitletypeDto) {
    return this.subtitletypesService.update(+id, updateSubtitletypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtitletypesService.remove(+id);
  }
}

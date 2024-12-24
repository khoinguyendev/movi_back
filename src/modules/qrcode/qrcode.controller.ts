import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { UpdateQrcodeDto } from './dto/update-qrcode.dto';
import { Public } from 'src/decorator/customize';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post()
  create(@Request() req, @Body() createQrcodeDto: CreateQrcodeDto) {
    return this.qrcodeService.create(req.user, createQrcodeDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.qrcodeService.findAll(req.user.id);
  }

  @Public()
  @Get('/scan')
  findOne(@Query('id') id: string) {
    return this.qrcodeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQrcodeDto: UpdateQrcodeDto) {
    return this.qrcodeService.update(+id, updateQrcodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qrcodeService.remove(+id);
  }
}

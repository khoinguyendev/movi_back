import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZaloPaymentService } from './zalo-payment.service';
import { CreateZaloPaymentDto } from './dto/create-zalo-payment.dto';
import { UpdateZaloPaymentDto } from './dto/update-zalo-payment.dto';

@Controller('zalo-payment')
export class ZaloPaymentController {
  constructor(private readonly zaloPaymentService: ZaloPaymentService) {}

  @Post()
  create(@Body() createZaloPaymentDto: CreateZaloPaymentDto) {
    return this.zaloPaymentService.create(createZaloPaymentDto);
  }

  @Get()
  findAll() {
    return this.zaloPaymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zaloPaymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZaloPaymentDto: UpdateZaloPaymentDto) {
    return this.zaloPaymentService.update(+id, updateZaloPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zaloPaymentService.remove(+id);
  }
}

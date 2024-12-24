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
import { PaymentMomoService } from './payment-momo.service';
import {
  CreatePaymentMomoDto,
  SuccessMoMoDto,
} from './dto/create-payment-momo.dto';
import { UpdatePaymentMomoDto } from './dto/update-payment-momo.dto';
import { Public } from 'src/decorator/customize';

@Controller('payment-momo')
export class PaymentMomoController {
  constructor(private readonly paymentMomoService: PaymentMomoService) {}

  @Public()
  @Post()
  async create(@Body() createPaymentMomoDto: CreatePaymentMomoDto) {
    createPaymentMomoDto.amount = '12000';
    createPaymentMomoDto.orderInfo = 'Thanh toán đơn hàng';
    createPaymentMomoDto.redirectUrl = 'http://localhost:3000/';
    createPaymentMomoDto.ipnUrl = 'http://localhost:3000/';
    createPaymentMomoDto.orderIdUI = '12sda000';
    try {
      const result =
        await this.paymentMomoService.createPayment(createPaymentMomoDto);
      if (result && result.payUrl) {
        return { success: true, data: result };
      }
      return {
        success: false,
        message: 'Payment URL not generated',
        data: result,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  findAll() {
    return this.paymentMomoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMomoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMomoDto: UpdatePaymentMomoDto,
  ) {
    return this.paymentMomoService.update(+id, updatePaymentMomoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMomoService.remove(+id);
  }

  @Post('/result-success')
  resultSuccess(@Request() req, @Body() successMoMoDto: SuccessMoMoDto) {
    return this.paymentMomoService.resultSuccess(req.user, successMoMoDto);
  }
}

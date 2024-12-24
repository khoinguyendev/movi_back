import { Module } from '@nestjs/common';
import { ZaloPaymentService } from './zalo-payment.service';
import { ZaloPaymentController } from './zalo-payment.controller';

@Module({
  controllers: [ZaloPaymentController],
  providers: [ZaloPaymentService],
  exports: [ZaloPaymentService],
})
export class ZaloPaymentModule {}

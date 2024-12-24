import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/Ticket';
import { TicketsGateway } from 'src/gateway/TicketsGateway';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { QrcodeModule } from '../qrcode/qrcode.module';
import { PaymentMomoModule } from '../payment-momo/payment-momo.module';
import { ZaloPaymentModule } from '../zalo-payment/zalo-payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    ShowtimesModule,
    QrcodeModule,
    PaymentMomoModule,
    ZaloPaymentModule,
  ],

  controllers: [TicketsController],
  providers: [TicketsService, TicketsGateway],
  exports: [TicketsService],
})
export class TicketsModule {}

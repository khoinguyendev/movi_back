import { Module } from '@nestjs/common';
import { PaymentMomoService } from './payment-momo.service';
import { PaymentMomoController } from './payment-momo.controller';
import { UserPointModule } from '../user-point/user-point.module';
import { QrcodeModule } from '../qrcode/qrcode.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UserPointModule, QrcodeModule, UsersModule],
  controllers: [PaymentMomoController],
  providers: [PaymentMomoService],
  exports: [PaymentMomoService],
})
export class PaymentMomoModule {}

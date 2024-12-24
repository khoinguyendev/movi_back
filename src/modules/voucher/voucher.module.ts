import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from 'src/entities/Voucher';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])],

  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}

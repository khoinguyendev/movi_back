import { Module } from '@nestjs/common';
import { UserVoucherService } from './user-voucher.service';
import { UserVoucherController } from './user-voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVoucher } from 'src/entities/UserVoucher';
import { UserPointModule } from '../user-point/user-point.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserVoucher]), UserPointModule],

  controllers: [UserVoucherController],
  providers: [UserVoucherService],
})
export class UserVoucherModule {}

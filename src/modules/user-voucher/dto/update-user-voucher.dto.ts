import { PartialType } from '@nestjs/mapped-types';
import { CreateUserVoucherDto } from './create-user-voucher.dto';

export class UpdateUserVoucherDto extends PartialType(CreateUserVoucherDto) {}

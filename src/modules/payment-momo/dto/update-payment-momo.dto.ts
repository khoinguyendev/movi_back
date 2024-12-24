import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentMomoDto } from './create-payment-momo.dto';

export class UpdatePaymentMomoDto extends PartialType(CreatePaymentMomoDto) {}

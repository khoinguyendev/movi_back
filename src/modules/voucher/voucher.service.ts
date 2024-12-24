import { Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from 'src/entities/Voucher';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
  ) {}
  create(createVoucherDto: CreateVoucherDto) {
    const {
      code,
      discountAmount,
      discountType,
      expiryDate,
      startDate,
      usageLimit,
      score,
    } = createVoucherDto;
    console.log(createVoucherDto);
    const voucher = this.voucherRepository.create({
      code,
      discountAmount,
      discountType,
      expiryDate,
      startDate,
      usageLimit,
      score,
    });
    return this.voucherRepository.save(voucher);
  }

  findAll() {
    return this.voucherRepository.find();
  }
  async findAllFont() {
    // today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày ở định dạng 'yyyy-MM-dd'
    return await this.voucherRepository
      .createQueryBuilder('voucher')
      .where('voucher.usageLimit > 0')
      .andWhere('DATE(voucher.expiryDate) >= :today', { today })
      .getMany();
  }
  findOne(id: number) {
    return `This action returns a #${id} voucher`;
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }

  async check(id: number) {
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày ở định dạng 'yyyy-MM-dd'
    return await this.voucherRepository
      .createQueryBuilder('voucher')
      .where('voucher.id  = :id', { id: id })
      .andWhere('DATE(voucher.expiryDate) >= :today', { today })
      .andWhere('DATE(voucher.startDate) <= :today', { today })
      .getOne();
  }
}

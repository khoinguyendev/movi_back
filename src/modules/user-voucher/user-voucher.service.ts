import { Injectable } from '@nestjs/common';
import { CreateUserVoucherDto } from './dto/create-user-voucher.dto';
import { UpdateUserVoucherDto } from './dto/update-user-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVoucher } from 'src/entities/UserVoucher';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User';
import { UserPointService } from '../user-point/user-point.service';
import { CreateUserPointDto } from '../user-point/dto/create-user-point.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserVoucherService {
  constructor(
    @InjectRepository(UserVoucher)
    private userVoucherRepository: Repository<UserVoucher>,
    private readonly userPointService: UserPointService,
  ) {}
  create(createUserVoucherDto: CreateUserVoucherDto) {
    return 'This action adds a new userVoucher';
  }
  async createChange(user: User, createUserVoucherDto: CreateUserVoucherDto) {
    const { quantity, voucher } = createUserVoucherDto;
    const userPoints = new CreateUserPointDto();
    userPoints.points = voucher.score * quantity;
    userPoints.description = 'Đổi mã';
    userPoints.transactionType = 'REDEEMED';
    userPoints.qrId = uuidv4();
    await this.userPointService.create(user, userPoints);
    await this.userVoucherRepository
      .createQueryBuilder()
      .update('user') // Tên bảng hoặc entity
      .set({ score: () => `score - ${voucher.score * quantity}` }) // Trừ điểm
      .where('id = :userId', { userId: user.id })
      .execute();
    await this.userVoucherRepository
      .createQueryBuilder()
      .update('voucher') // Tên bảng hoặc entity
      .set({ usageCount: () => `usageLimit - ${quantity}` }) // Trừ điểm
      .where('id = :voucherId', { voucherId: voucher.id })
      .execute();
    const userVoucher = this.userVoucherRepository.create({
      quantity: quantity,
      voucher: voucher,
      user: user,
    });
    return this.userVoucherRepository.save(userVoucher);
  }
  findAll(user: User) {
    return this.userVoucherRepository.find({
      relations: ['voucher'],
      where: { user: user },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} userVoucher`;
  }

  update(id: number, updateUserVoucherDto: UpdateUserVoucherDto) {
    return `This action updates a #${id} userVoucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVoucher`;
  }
}

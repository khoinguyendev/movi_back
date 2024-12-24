import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { UpdateQrcodeDto } from './dto/update-qrcode.dto';
import { QRCode } from 'src/entities/QRcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(QRCode)
    private qrcodeRepository: Repository<QRCode>,
  ) {}
  create(user: User, createQrcodeDto: CreateQrcodeDto) {
    const { qrData } = createQrcodeDto;
    const qrcode = this.qrcodeRepository.create({
      qrData,
      user: user,
    });
    return this.qrcodeRepository.save(qrcode);
  }

  findAll(id: number) {
    return this.qrcodeRepository.find({
      relations: ['showtime.movie'],
      where: { user: { id: id } },
    });
  }

  async findOne(id: string) {
    console.log(id);
    const qrcode = await this.qrcodeRepository.findOne({ where: { id: id } });
    if (!qrcode) {
      throw new BadRequestException('Vé không hợp lệ');
    }
    if (qrcode.isScanned) {
      throw new BadRequestException('Vé đã được quét');
    }
    qrcode.isScanned = true;

    return await this.qrcodeRepository.save(qrcode);
  }

  update(id: number, updateQrcodeDto: UpdateQrcodeDto) {
    return `This action updates a #${id} qrcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} qrcode`;
  }

  async resultSucess(id: string) {
    const qrCode = await this.qrcodeRepository.findOne({ where: { id: id } });
    if (!qrCode) {
      throw new NotFoundException('QRCode not found');
    }

    return qrCode;
  }
}

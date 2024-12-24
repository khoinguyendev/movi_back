import { Injectable } from '@nestjs/common';
import {
  CreatePaymentMomoDto,
  SuccessMoMoDto,
} from './dto/create-payment-momo.dto';
import { UpdatePaymentMomoDto } from './dto/update-payment-momo.dto';
import axios from 'axios';
import { UserPointService } from '../user-point/user-point.service';
import { QrcodeService } from '../qrcode/qrcode.service';
import { CreateUserPointDto } from '../user-point/dto/create-user-point.dto';
import { User } from 'src/entities/User';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class PaymentMomoService {
  private readonly endpoint =
    'https://test-payment.momo.vn/v2/gateway/api/create';
  private readonly accessKey = 'F8BBA842ECF85';
  private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private readonly partnerCode = 'MOMO';
  constructor(
    private qrcodeRepository: QrcodeService,
    private userPointerRepository: UserPointService,
    private userService: UsersService,
  ) {}
  async createPayment(dto: CreatePaymentMomoDto) {
    const { orderIdUI, amount, orderInfo, redirectUrl, ipnUrl } = dto;

    const orderId = orderIdUI;
    const requestId = orderIdUI;
    const extraData = '';
    const requestType = 'payWithMethod';
    const orderExpireTime = 5;

    const autoCapture = true;
    const lang = 'vi';

    // Tạo chữ ký
    const rawHash = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = require('crypto')
      .createHmac('sha256', this.secretKey)
      .update(rawHash)
      .digest('hex');

    // Chuẩn bị dữ liệu gửi
    const data = {
      partnerCode: this.partnerCode,
      requestId,
      amount,
      orderId,

      orderInfo,
      redirectUrl,
      ipnUrl,
      requestType,
      autoCapture,
      lang,
      orderExpireTime,
      extraData,
      signature,
    };

    // Gửi yêu cầu tới API của Momo
    try {
      const response = await axios.post(this.endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi nếu có
      if (error.response) {
        // Lỗi từ phía API
        throw new Error(
          `MoMo API Error: ${error.response.status} - ${error.response.data.message || error.response.data}`,
        );
      } else {
        // Lỗi mạng hoặc lỗi khác
        throw new Error(`HTTP Request Error: ${error.message}`);
      }
    }
  }
  create(createPaymentMomoDto: CreatePaymentMomoDto) {
    return 'This action adds a new paymentMomo';
  }
  findAll() {
    return `This action returns all paymentMomo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMomo`;
  }

  update(id: number, updatePaymentMomoDto: UpdatePaymentMomoDto) {
    return `This action updates a #${id} paymentMomo`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMomo`;
  }
  async resultSuccess(user: User, successMoMoDto: SuccessMoMoDto) {
    const { amount, orderId } = successMoMoDto;

    const qr = await this.userPointerRepository.findQrid(orderId);

    if (!qr) {
      try {
        const userPoints = new CreateUserPointDto();
        userPoints.points = Math.round((Number(amount) * 5) / (100 * 1000));
        userPoints.description = 'Mua vé';
        userPoints.transactionType = 'EARNED';
        userPoints.qrId = orderId;

        await this.userPointerRepository.create(user, userPoints); // Lưu trực tiếp

        await this.userService.updateDiem(user.id, userPoints.points);
      } catch (error) {
        if (error.code === '23505') {
          // Duplicate entry error (unique constraint violation)
          console.log('Duplicate qrId detected');
        } else {
          throw error;
        }
      }
    }

    return this.qrcodeRepository.resultSucess(orderId);
  }
}

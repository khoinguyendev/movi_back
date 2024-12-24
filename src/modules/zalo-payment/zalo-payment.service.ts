import { Injectable } from '@nestjs/common';
import { CreateZaloPaymentDto } from './dto/create-zalo-payment.dto';
import { UpdateZaloPaymentDto } from './dto/update-zalo-payment.dto';
import axios from 'axios';
import moment from 'moment';
import CryptoJS from 'crypto-js';

@Injectable()
export class ZaloPaymentService {
  private readonly app_id: string = '2553'; // app_id của bạn
  private readonly key1: string = 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL'; // key1 của bạn
  private readonly endpoint: string = 'https://sb-openapi.zalopay.vn/v2/create'; // Endpoint của ZaloPay

  create(createZaloPaymentDto: CreateZaloPaymentDto) {
    return 'This action adds a new zaloPayment';
  }

  findAll() {
    return `This action returns all zaloPayment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zaloPayment`;
  }

  update(id: number, updateZaloPaymentDto: UpdateZaloPaymentDto) {
    return `This action updates a #${id} zaloPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} zaloPayment`;
  }

  async createPayment(dto: CreateZaloPaymentDto) {
    const { amount, orderInfo, redirectUrl, orderIdUI, callbackUrl } = dto;
    const embed_data = {
      promotioninfo: '',
      merchantinfo: 'embeddata123',
      redirecturl: redirectUrl,
    };

    const items = [
      {
        itemid: 'knb',
        itemname: 'kim nguyen bao',
        itemprice: 198400,
        itemquantity: 1,
      },
    ];

    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: this.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      expire_duration_seconds: 300,
      callback_url: 'https://www.youtube.com/watch?v=AU4FGEt9yX4', // Example URL, replace with your actual callback
      description: `Lazada - Payment for the order #${orderIdUI}`,
      // bank_code: 'zalopayapp',
    };

    const data = `${this.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;

    const mac = CryptoJS.HmacSHA256(data, this.key1).toString();
    console.log(mac);
    // Thêm chữ ký vào dữ liệu order
    order['mac'] = mac;

    // Gửi yêu cầu tới API của ZaloPay
    try {
      const response = await axios.post(this.endpoint, null, { params: order });

      // Trả về phản hồi từ ZaloPay
      if (response.data) {
        return response.data;
      } else {
        throw new Error('ZaloPay API Error: ' + response.data?.returnmessage);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      if (error.response) {
        throw new Error(
          `ZaloPay API Error: ${error.response.status} - ${error.response.data.message}`,
        );
      } else {
        throw new Error(`HTTP Request Error: ${error.message}`);
      }
    }
  }
}

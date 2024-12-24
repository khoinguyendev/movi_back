import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto, FilterTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Ticket } from 'src/entities/Ticket';
import { TicketsGateway } from 'src/gateway/TicketsGateway';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { User } from 'src/entities/User';
import { QrcodeService } from '../qrcode/qrcode.service';
import * as CryptoJS from 'crypto-js';
import { QRCode } from 'src/entities/QRcode';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { console } from 'inspector';
import { PaymentMomoService } from '../payment-momo/payment-momo.service';
import { CreatePaymentMomoDto } from '../payment-momo/dto/create-payment-momo.dto';
import { CreateZaloPaymentDto } from '../zalo-payment/dto/create-zalo-payment.dto';
import { ZaloPaymentService } from '../zalo-payment/zalo-payment.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private readonly dataSource: DataSource,
    private readonly ticketsGateway: TicketsGateway,
    private showtimeRepository: ShowtimesService,
    private qrcodeRepository: QrcodeService,
    private momoRepository: PaymentMomoService,
    private zaloRepository: ZaloPaymentService,
  ) {}
  // async create(createTicketDto: CreateTicketDto) {
  //   const { showtimeId,tickets } = createTicketDto;
  //   //ghi vao database
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const ticketRecords = tickets.map((ticket) =>
  //       queryRunner.manager.create(Ticket, ticket),
  //     );
  //     const savedTickets = await queryRunner.manager.save(
  //       Ticket,
  //       ticketRecords,
  //     );

  //     await queryRunner.commitTransaction();

  //     // Notify clients of the newly booked tickets
  //     savedTickets.forEach((ticket) =>
  //       this.ticketsGateway.notifyTicketBooked(ticket),
  //     );

  //     return savedTickets;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();

  //     if (error.code === 'ER_DUP_ENTRY') {
  //       // Unique constraint violation
  //       throw new ConflictException(
  //         'One or more seats are already booked for the selected showtime.',
  //       );
  //     }

  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async create(user: User, createTicketDto: CreateTicketDto) {
    const { showtimeId, tickets, price } = createTicketDto;

    let showtime = await this.showtimeRepository.findOne(showtimeId);

    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    const secretKey = 'khoinguyeno1';
    const seatNumbers = tickets.map((ticket) => {
      ticket.price = showtime.price;
      ticket.showtime = showtime;
      ticket.user = user;
      ticket.status = 'booked';
      return ticket.seat.seatNumber;
    });
    const link = uuidv4();

    const qrData = {
      Phim: showtime.movie.title,
      Rạp: showtime.hall.cinema.name,
      Phòng: showtime.hall.name,
      'Xuất chiếu': showtime.startTime
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      Ghế: seatNumbers.join(','),
      Giá: price.toString(),
      // link: CryptoJS.AES.encrypt(link, secretKey).toString(),
    };

    const qrcode = new QRCode();
    qrcode.qrData = JSON.stringify(qrData);
    qrcode.user = user;
    qrcode.showtime = showtime;
    qrcode.id = link;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lưu QRCode vào database
      const savedQrCode = await queryRunner.manager.save(QRCode, qrcode);

      // Tạo và lưu danh sách ticket
      const ticketRecords = tickets.map((ticket) => {
        ticket.qrCode = savedQrCode; // Gắn QRCode đã lưu vào ticket
        return queryRunner.manager.create(Ticket, ticket); // Chỉ tạo entity
      });

      const savedTickets = await queryRunner.manager.save(
        Ticket,
        ticketRecords,
      ); // Lưu tickets vào database

      await queryRunner.commitTransaction();

      // Notify clients of the newly booked tickets
      savedTickets.forEach((ticket) =>
        this.ticketsGateway.notifyTicketBooked(ticket),
      );
      const createPaymentMomoDto = new CreatePaymentMomoDto();
      createPaymentMomoDto.amount = price.toString();
      createPaymentMomoDto.orderInfo = 'Thanh toán đơn hàng';
      createPaymentMomoDto.redirectUrl = 'http://localhost:3000/payment/result';
      createPaymentMomoDto.ipnUrl = 'http://localhost:3000/';
      createPaymentMomoDto.orderIdUI = link;
      return this.momoRepository.createPayment(createPaymentMomoDto);
      // return savedTickets;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'One or more seats are already booked for the selected showtime.',
        );
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createZalo(user: User, createTicketDto: CreateTicketDto) {
    const { price, showtimeId, tickets } = createTicketDto;
    let showtime = await this.showtimeRepository.findOne(showtimeId);

    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    const seatNumbers = tickets.map((ticket) => {
      ticket.price = showtime.price;
      ticket.showtime = showtime;
      ticket.user = user;
      ticket.status = 'booked';
      return ticket.seat.seatNumber;
    });
    const link = uuidv4();
    const qrData = {
      Phim: showtime.movie.title,
      Rạp: showtime.hall.cinema.name,
      Phòng: showtime.hall.name,
      'Xuất chiếu': showtime.startTime
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      Ghế: seatNumbers.join(','),
      Giá: price.toString(),
    };

    const qrcode = new QRCode();
    qrcode.qrData = JSON.stringify(qrData);
    qrcode.user = user;
    qrcode.showtime = showtime;
    qrcode.id = link;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lưu QRCode vào database
      const savedQrCode = await queryRunner.manager.save(QRCode, qrcode);

      // Tạo và lưu danh sách ticket
      const ticketRecords = tickets.map((ticket) => {
        ticket.qrCode = savedQrCode; // Gắn QRCode đã lưu vào ticket
        return queryRunner.manager.create(Ticket, ticket); // Chỉ tạo entity
      });

      const savedTickets = await queryRunner.manager.save(
        Ticket,
        ticketRecords,
      ); // Lưu tickets vào database

      await queryRunner.commitTransaction();

      // Notify clients of the newly booked tickets
      savedTickets.forEach((ticket) =>
        this.ticketsGateway.notifyTicketBooked(ticket),
      );
      const createPaymentMomoDto = new CreateZaloPaymentDto();
      createPaymentMomoDto.amount = price.toString();
      createPaymentMomoDto.orderInfo = 'Thanh toán đơn hàng';
      createPaymentMomoDto.redirectUrl = `http://localhost:3000/payment/zalo/result?orderId=${link}`;
      createPaymentMomoDto.callbackUrl = `http://localhost:3000/payment/zalo/result?orderId=${link}`;
      createPaymentMomoDto.orderIdUI = link;
      return this.zaloRepository.createPayment(createPaymentMomoDto);
      // return savedTickets;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'One or more seats are already booked for the selected showtime.',
        );
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

  async findAllByShowtime(filterTicketDto: FilterTicketDto) {
    const { showtimeId } = filterTicketDto;
    let data = await this.ticketRepository.find({
      relations: ['seat'], // Không cần lấy showtime ở đây
      where: { showtime: { id: showtimeId } }, // Chỉ điều kiện
    });

    let showtime = await this.showtimeRepository.findOne(showtimeId);
    return {
      seatBooked: data,
      showtime: showtime,
    };
  }
}

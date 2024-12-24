import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  Index,
} from 'typeorm';
import { Showtime } from './Showtime';
import { User } from './User';
import { Seat } from './Seat';
import { QRCode } from './QRcode';

@Entity()
@Unique(['showtime', 'seat'])
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: ['booked', 'cancelled'] })
  status: 'booked' | 'cancelled';

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets)
  @JoinColumn({ name: 'showtimeId' }) // Định nghĩa cột showtimeId trong bảng Ticket
  showtime: Showtime;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'userId' }) // Định nghĩa cột userId trong bảng Ticket
  user: User;
  @ManyToOne(() => QRCode, (qrCode) => qrCode.tickets, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  qrCode: QRCode;
  @ManyToOne(() => Seat, (seat) => seat.tickets)
  @JoinColumn({ name: 'seatId' }) // Định nghĩa cột seatId trong bảng Ticket
  seat: Seat;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

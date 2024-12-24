import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './Ticket';
import { User } from './User';
import { Showtime } from './Showtime';

@Entity()
export class QRCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  qrData: string; // Chứa thông tin vé dạng JSON (danh sách các vé)

  @Column({ default: false })
  isScanned: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.qrCode, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];
  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'userId' }) // Định nghĩa cột userId trong bảng Ticket
  user: User;
  @ManyToOne(() => Showtime, (showtime) => showtime.qrcodes)
  @JoinColumn({ name: 'showtimeId' }) // Định nghĩa cột showtimeId trong bảng Ticket
  showtime: Showtime;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

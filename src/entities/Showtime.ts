import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Movie } from './Movie';
import { Hall } from './Hall';
import { Ticket } from './Ticket';
import { SubtitleType } from './SubtitleType';
import { QRCode } from './QRcode';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('timestamp')
  startTime: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Hall, (hall) => hall.showtimes)
  hall: Hall;
  @ManyToOne(() => SubtitleType, (subtitleType) => subtitleType.showtimes)
  type: SubtitleType;
  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
  tickets: Ticket[];
  @OneToMany(() => QRCode, (qrcode) => qrcode.showtime)
  qrcodes: QRCode[];
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

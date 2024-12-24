import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Cinema } from './Cinema';
import { Seat } from './Seat';
import { Showtime } from './Showtime';

@Entity()
export class Hall {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column('int')
  seatCount: number;
  @Column({ type: 'text' })
  diagram: string;
  @ManyToOne(() => Cinema, (cinema) => cinema.halls)
  cinema: Cinema;

  @OneToMany(() => Seat, (seat) => seat.hall)
  seats: Seat[];

  @OneToMany(() => Showtime, (showtime) => showtime.hall)
  showtimes: Showtime[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

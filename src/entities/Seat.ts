import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Hall } from './Hall';
import { Ticket } from './Ticket';

@Entity()
export class Seat {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  seatNumber: string;

  @Column({ default: false })
  isVip: boolean;

  @ManyToOne(() => Hall, (hall) => hall.seats)
  hall: Hall;

  @OneToMany(() => Ticket, (ticket) => ticket.seat)
  tickets: Ticket[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

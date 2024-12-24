import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Voucher } from './Voucher';
@Entity()
export class UserVoucher {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.userVouchers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Voucher, (voucher) => voucher.userVouchers, {
    onDelete: 'CASCADE',
  })
  voucher: Voucher;

  @Column({ type: 'bool', default: false })
  redeemed: boolean; // Whether the voucher has been redeemed
  @Column()
  quantity: number; // Whether the voucher has been redeemed

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

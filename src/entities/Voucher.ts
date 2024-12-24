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
import { UserVoucher } from './UserVoucher';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  code: string; // Unique voucher code

  @Column('int')
  discountAmount: number; // Discount amount or percentage
  @Column('int')
  score: number; // Discount amount or percentage
  @Column({ type: 'enum', enum: ['FIXED', 'PERCENT'], default: 'FIXED' })
  discountType: string; // Type of discount
  @Column({ type: 'timestamp', update: false, default: null })
  startDate: Date; // Expiry date of the voucher
  @Column({ type: 'timestamp', update: false, default: null })
  expiryDate: Date; // Expiry date of the voucher

  @Column('int', { default: 0 })
  usageLimit: number; // Maximum times the voucher can be used

  @Column('int', { default: 0 })
  usageCount: number; // Times the voucher has been used

  @OneToMany(() => UserVoucher, (userVoucher) => userVoucher.voucher)
  userVouchers: UserVoucher[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

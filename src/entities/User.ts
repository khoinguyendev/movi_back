import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Ticket } from './Ticket';
import { QRCode } from './QRcode';
import { Review } from './Review';
import { UserVoucher } from './UserVoucher';
import { UserPoint } from './UserPoint';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  username: string;
  @Exclude()
  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;
  @Exclude()
  @Column({ name: 'account_type' })
  accountType: string;
  @Exclude()
  @Column({ default: 'USER' })
  role: string;
  @Column()
  avatar: string;
  @Column('int')
  score: number;
  @Exclude()
  @Column({ name: 'is_active', default: false, type: 'bool' })
  isActive: boolean;
  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
  @OneToMany(() => QRCode, (qrCode) => qrCode.user)
  qrCodes: QRCode[];
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
  @OneToMany(() => UserPoint, (userPoints) => userPoints.user)
  points: UserPoint[];

  @OneToMany(() => UserVoucher, (userVoucher) => userVoucher.user)
  userVouchers: UserVoucher[];
  @Exclude()
  @Column({ name: 'code_id' })
  codeId: string;
  @Exclude()
  @Column({ name: 'code_expried', type: 'timestamp', default: null })
  codeExpired: Date;
  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // Tự động tạo ngày giờ khi bản ghi được tạo
  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; // Tự động cập nhật khi bản ghi được chỉnh sửa
}

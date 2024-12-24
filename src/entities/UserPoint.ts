import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class UserPoint {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.points, { onDelete: 'CASCADE' })
  user: User;

  @Column('int', { default: 0 })
  points: number; // Points earned or redeemed

  @Column({
    type: 'enum',
    enum: ['EARNED', 'REDEEMED', 'EXPIRED'],
    default: 'EARNED',
  })
  transactionType: string; // Type of transaction

  @Column('text', { nullable: true })
  description: string; // Optional description for the transaction
  @Column({ unique: true })
  qrId: string; // Optional description for the transaction
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

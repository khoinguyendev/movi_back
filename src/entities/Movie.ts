import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Showtime } from './Showtime';
import { Review } from './Review';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  duration: number; // Duration in minutes

  @Column()
  genre: string;

  @Column()
  country: string;

  @Column('date')
  releaseDate: Date;

  @Column()
  poster: string; // Link to poster image
  @Column()
  background: string;
  @Column({ type: 'enum', enum: ['K', 'P', 'T13', 'T16', 'T18'] })
  label: string;
  @Column({
    type: 'enum',
    enum: ['showing', 'comingsoon', 'outshow'],
    default: 'showing',
  })
  status: string;
  @Column()
  trailerUrl: string; // Link to trailer video
  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Movie } from './Movie';

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('text')
  content: string; // The review content

  @Column('int', { default: 0 })
  rating: number; // Rating out of 10 or a scale you prefer
  @Column('text')
  images: string; // The review content
  @Column({ default: false })
  isPublic: boolean;
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User; // The user who wrote the review

  @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
  movie: Movie; // The movie being reviewed

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // Automatically set when the review is created

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; // Automatically updated when the review is modified
}

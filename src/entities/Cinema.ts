import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Hall } from './Hall';
import { Area } from './Area';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text')
  location: string;
  @Column('text')
  map: string;
  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;
  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @ManyToOne(() => Area, (area) => area.cinemas)
  area: Area;
  @OneToMany(() => Hall, (hall) => hall.cinema)
  halls: Hall[];

  // @ManyToOne(() => Brand, (brand) => brand.cinemas)
  // brand: Brand;
}

import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/entities/Seat';
import { Repository } from 'typeorm';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}
  async create(createSeatDto: CreateSeatDto[]) {
    const seatRecords = this.seatRepository.create(createSeatDto); // Accept an array of objects
    return await this.seatRepository.save(seatRecords);
  }

  findAll() {
    return `This action returns all seats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seat`;
  }

  update(id: number, updateSeatDto: UpdateSeatDto) {
    return `This action updates a #${id} seat`;
  }

  remove(id: number) {
    return `This action removes a #${id} seat`;
  }
}

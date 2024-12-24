import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Hall } from 'src/entities/Hall';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatsService } from '../seats/seats.service';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private hallsRepository: Repository<Hall>,
    private seatRepository: SeatsService,
  ) {}
  async create(createHallDto: CreateHallDto) {
    const { cinemaId, diagram, name, seatCount } = createHallDto;
    const cinemaRecord = this.hallsRepository.create({
      diagram,
      name,
      seatCount,
      cinema: {
        id: cinemaId,
      },
    });
    const kq = await this.hallsRepository.save(cinemaRecord);
    if (kq.id) {
      let seat: any = [];
      let matrix = JSON.parse(diagram);

      const newMaxtrix = matrix.map((row) => {
        return row.map((cell) => {
          if (cell.seatNumber !== '0') {
            seat.push({
              id: cell.id,
              seatNumber: cell.seatNumber,
              isVip: 0,
              hall: {
                id: kq.id,
              },
            });
          }
        });
      });
      const kq2 = await this.seatRepository.create(seat);
      return kq2;
    }
    return kq;
  }

  findAll() {
    return this.hallsRepository.find();
  }

  async findOne(id: number) {
    const hall = await this.hallsRepository.findOne({
      where: { id },
    });
    if (hall) return hall;
    throw new BadRequestException('Not found');
  }

  update(id: number, updateHallDto: UpdateHallDto) {
    return `This action updates a #${id} hall`;
  }

  remove(id: number) {
    return `This action removes a #${id} hall`;
  }
}

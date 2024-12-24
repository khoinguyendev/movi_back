import { Injectable } from '@nestjs/common';
import { CreateShowtimeDto, FillterSTDTO } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from 'src/entities/Showtime';
import { Repository } from 'typeorm';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
  ) {}
  create(createShowtimeDto: CreateShowtimeDto) {
    return 'This action adds a new showtime';
  }

  findAll() {
    return `This action returns all showtimes`;
  }

  // async findOne(id: number) {
  //   return await this.showtimesRepository.findOne({
  //     relations: ['movie', 'type', 'hall'],
  //     select: ['hall.id', 'hall.name'],
  //     where: { id },
  //   });
  // }
  async findOne(id: number) {
    return await this.showtimesRepository
      .createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie') // Lấy toàn bộ movie
      .leftJoinAndSelect('showtime.type', 'type') // Lấy toàn bộ type
      .leftJoin('showtime.hall', 'hall') // Chỉ join hall mà không lấy toàn bộ
      .addSelect(['hall.id', 'hall.name']) // Chọn các trường cụ thể của hall
      .leftJoinAndSelect('hall.cinema', 'cinema') // Lấy toàn bộ type
      .where('showtime.id = :id', { id })
      .getOne();
  }

  update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
    return `This action updates a #${id} showtime`;
  }

  remove(id: number) {
    return `This action removes a #${id} showtime`;
  }

  async findByMovie(fillterSTDTO: FillterSTDTO) {
    const {
      movieid = 1,
      sortField = 'id',
      sortOrder = 'ASC',
      searchField,
      searchValue,
    } = fillterSTDTO;

    const searchCondition =
      searchField && searchValue ? { [searchField]: searchValue } : {};
    return this.showtimesRepository.find({
      relations: ['hall', 'hall.cinema'], // Specify nested relations
    });
  }
}

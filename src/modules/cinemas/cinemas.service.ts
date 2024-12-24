import { Injectable } from '@nestjs/common';
import {
  CreateCinemaDto,
  FilterCinemaDto,
  ShowTimeCinemaDto,
} from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from 'src/entities/Cinema';
import { Repository } from 'typeorm';
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinema)
    private cinemasRepository: Repository<Cinema>,
  ) {}
  create(createCinemaDto: CreateCinemaDto) {
    const { areaId, latitude, location, longitude, map, name } =
      createCinemaDto;
    const cinema = this.cinemasRepository.create({
      area: { id: areaId },
      latitude,
      location,
      longitude,
      map,
      name,
    });
    return this.cinemasRepository.save(cinema);
  }

  findAll() {
    return this.cinemasRepository.find({ relations: ['area'] });
  }
  async findAllFilter(filterCinemaDto: FilterCinemaDto) {
    const { areaId, limit = 10, page = 1 } = filterCinemaDto; // Default limit = 10, page = 1

    const queryBuilder = this.cinemasRepository
      .createQueryBuilder('cinema')
      .leftJoinAndSelect('cinema.area', 'area');

    if (areaId && areaId !== 0) {
      queryBuilder.where('area.id = :areaId', { areaId });
    }

    // Tổng số bản ghi
    const totalItems = await queryBuilder.getCount();

    // Áp dụng phân trang
    const currentPage = page < 1 ? 1 : page; // Đảm bảo page >= 1
    const totalPages = Math.ceil(totalItems / limit); // Tính tổng số trang
    const offset = (currentPage - 1) * limit; // Tính vị trí bắt đầu

    const data = await queryBuilder.skip(offset).take(limit).getMany();

    return {
      currentPage,
      totalPages,
      totalItems,
      data,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} cinema`;
  }

  update(id: number, updateCinemaDto: UpdateCinemaDto) {
    return `This action updates a #${id} cinema`;
  }

  remove(id: number) {
    return `This action removes a #${id} cinema`;
  }

  async getShowtimesToday(showTimeCinemaDto: ShowTimeCinemaDto) {
    // const vietnamTimeZone = 'Asia/Ho_Chi_Minh'; // Set the Vietnam time zone

    // // Convert input date to Vietnam time zone
    // const today = toZonedTime(
    //   new Date(showTimeCinemaDto.date),
    //   vietnamTimeZone,
    // ); // This could be a string, make sure it converts to Date
    const today = new Date(showTimeCinemaDto.date);
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Set start of the day
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set end of the day

    console.log({
      today,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });

    const queryBuilder = this.cinemasRepository
      .createQueryBuilder('cinema')
      .leftJoinAndSelect('cinema.halls', 'hall')
      .leftJoinAndSelect('cinema.area', 'area')
      .leftJoinAndSelect('hall.showtimes', 'showtime')
      .leftJoin('showtime.movie', 'movie') // Only join, no movie fields selected
      .leftJoinAndSelect('showtime.type', 'subtitle_type')

      .select([
        'cinema', // Select all fields of cinema
        'hall.id', // Select only the id of hall
        'hall.name',
        'subtitle_type', // Select all fields of subtitle_type
        'showtime', // Select all fields of showtime
      ])
      .where('showtime.startTime BETWEEN :startOfDay AND :endOfDay', {
        startOfDay: startOfDay, // Ensure it's in ISO string format
        endOfDay: endOfDay,
      })
      .andWhere('movie.id = :movieId', { movieId: showTimeCinemaDto.movieId })
      .andWhere('area.id = :location', {
        location: showTimeCinemaDto.location,
      });
    // Add conditional filter for location if it exists
    // if (showTimeCinemaDto.location) {
    //   queryBuilder.andWhere('cinema.location LIKE :location', {
    //     location: `%${showTimeCinemaDto.location}%`,
    //   });
    // }

    return await queryBuilder.getMany();
  }
}

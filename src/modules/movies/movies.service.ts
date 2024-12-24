import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/entities/Movie';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}
  async create(createMovieDto: CreateMovieDto[]) {
    // Create and save movie records
    const movieRecords = this.moviesRepository.create(createMovieDto); // Accepts an array
    return await this.moviesRepository.save(movieRecords);
  }

  findAll() {
    return this.moviesRepository.find();
  }

  findAllFilter(status: string) {
    return this.moviesRepository.find({
      where: { status },
    });
  }
  async findOne(id: number) {
    const hall = await this.moviesRepository.findOne({
      where: { id },
    });
    if (hall) return hall;
    throw new BadRequestException('Not found');
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }

  search(title: string) {
    console.log(title);
    return this.moviesRepository
      .createQueryBuilder('movie')
      .where('movie.title LIKE :title', { title: `%${title}%` })
      .getMany();
  }

  async getTopMoviesWithMostTickets(limit: number = 5) {
    const result = await this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoin('movie.showtimes', 'showtime')
      .leftJoin('showtime.tickets', 'ticket')
      .select('movie') // Chọn tất cả các trường từ bảng Movie
      .addSelect('COUNT(ticket.id)', 'ticketCount') // Thêm tổng số vé
      .where('ticket.status = :status', { status: 'booked' }) // Chỉ tính vé đã đặt
      .groupBy('movie.id') // Nhóm theo ID của movie
      .orderBy('ticketCount', 'DESC') // Sắp xếp theo số lượng vé giảm dần
      .limit(limit)
      .getRawAndEntities(); // Lấy cả dữ liệu thô và entity
    const mergedResult = result.entities.map((movie, index) => ({
      ...movie,
      ticketCount: result.raw[index].ticketCount,
    }));
    return mergedResult;
  }
}

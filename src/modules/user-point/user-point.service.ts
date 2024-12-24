import { Injectable } from '@nestjs/common';
import { CreateUserPointDto } from './dto/create-user-point.dto';
import { UpdateUserPointDto } from './dto/update-user-point.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPoint } from 'src/entities/UserPoint';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User';

@Injectable()
export class UserPointService {
  constructor(
    @InjectRepository(UserPoint)
    private userPointRepository: Repository<UserPoint>,
  ) {}
  create(user: User, createUserPointDto: CreateUserPointDto) {
    const { description, points, transactionType, qrId } = createUserPointDto;
    const userPoint = this.userPointRepository.create({
      description,
      points,
      transactionType,
      user,
      qrId,
    });
    return this.userPointRepository.save(userPoint);
  }

  async findAll(user: User) {
    const userPoint = await this.userPointRepository.find({
      where: { user },
      order: { createdAt: 'DESC' },
    });

    return userPoint;
  }
  async findQrid(id: string) {
    const qrId = await this.userPointRepository.findOne({
      where: { qrId: id },
    });
    if (qrId) {
      return qrId;
    }
    return null;
  }
  async getScore(user: User) {
    const totalPoints = await this.userPointRepository
      .createQueryBuilder('userPoint')
      .select('SUM(userPoint.points)', 'total')
      .where('userPoint.userId = :userId', { userId: user.id })
      .getRawOne();

    return totalPoints;
  }
  findOne(id: number) {
    return `This action returns a #${id} userPoint`;
  }

  update(id: number, updateUserPointDto: UpdateUserPointDto) {
    return `This action updates a #${id} userPoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPoint`;
  }
}

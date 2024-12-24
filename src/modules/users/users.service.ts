import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateRandomSixDigits, hashPassword } from 'src/helpers/util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User';
import { instanceToPlain } from 'class-transformer';
import {
  CreateAuthDto,
  forGotPasswordDto,
  getCodeDto,
  resetPasswordDto,
  verifyAuthDto,
} from 'src/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { PaginationDTO } from '../pagination/dto/pagination.dto';
import * as fs from 'node:fs';
import { UserPointService } from '../user-point/user-point.service';
import { CreateUserPointDto } from '../user-point/dto/create-user-point.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly userPointService: UserPointService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const {
      username,
      address,
      accountType,
      isActive,
      password,
      role,
      phone,
      email,
    } = createUserDto;
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (userExist) {
      throw new ConflictException('Email already exists');
    }
    const hashPass = hashPassword(password);
    const userRecord = this.usersRepository.create({
      username,
      address,
      accountType,
      isActive,
      password: hashPass,
      role,
      phone,
      email,
      score: 10,
    });
    const user = await this.usersRepository.save(userRecord);

    return instanceToPlain(user);
  }

  //TÌM TẤT CẢ CÓ PHÂN TRANG
  async findAll(paginationDTO: PaginationDTO) {
    const {
      page = 1,
      limit = 10,
      sortField = 'id',
      sortOrder = 'ASC',
      searchField,
      searchValue,
    } = paginationDTO;
    const skip = (page - 1) * limit;

    // Construct the search condition if both searchField and searchValue are provided
    const searchCondition =
      searchField && searchValue ? { [searchField]: searchValue } : {};

    const [items, totalItems] = await this.usersRepository.findAndCount({
      skip: skip,
      take: limit,
      where: searchCondition, // Dynamic search condition
      order: {
        [sortField]: sortOrder, // Dynamic sorting
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: instanceToPlain(items), // Plain list of records for the current page
      totalItems, // Total number of records in the database
      totalPages, // Total number of pages
      currentPage: page, // Current page
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return instanceToPlain(user);
  }
  async updateDiem(id: number, score: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.score += score;
    return await this.usersRepository.save(user); // Lưu dữ liệu đã được cập nhật
  }
  //UPDATE USER
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatar) {
      const oldFilePath = `./uploads/avatar/${user.avatar}`;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Xóa file cũ
      }
    }

    // Chỉ cập nhật các trường có giá trị
    Object.keys(updateUserDto).forEach((key) => {
      if (updateUserDto[key] !== undefined) {
        user[key] = updateUserDto[key];
      }
    });

    return await this.usersRepository.save(user); // Lưu dữ liệu đã được cập nhật
  }

  // TÌM THEO EMAIL
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }
  //
  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //register
  async register(registerDto: CreateAuthDto) {
    const { username, password, email } = registerDto;
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (userExist) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashPass = hashPassword(password);
    const codeId = generateRandomSixDigits();
    const userRecord = this.usersRepository.create({
      username: username,
      password: hashPass,
      isActive: false,
      score: 10,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
      email,
    });

    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Active your account ✔', // Subject line
      template: 'register',
      context: {
        name: email,
        activationCode: codeId,
      },
    });
    const user = await this.usersRepository.save(userRecord);
    const userPoints = new CreateUserPointDto();
    userPoints.points = 10;
    userPoints.description = 'Đăng kí thành viên';
    userPoints.transactionType = 'EARNED';
    userPoints.qrId = uuidv4();
    await this.userPointService.create(user, userPoints);
    return user;
  }
  async verify(data: verifyAuthDto) {
    const { id, code } = data;
    const user = await this.usersRepository.findOne({
      where: { id, codeId: code },
    });
    if (!user) throw new BadRequestException('Mã code không hợp lệ');
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      const userUpdate = this.usersRepository.create({
        ...user,
        isActive: true,
      });
      return await this.usersRepository.update(user.id, userUpdate);
    } else {
      throw new BadRequestException('Thời gian mã code đã hết hạn');
    }
  }
  async getCode(data: getCodeDto) {
    const { email } = data;
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (!userExist) {
      throw new BadRequestException('Email không tồn tại');
    }
    if (userExist.isActive) {
      throw new BadRequestException('Tài khoản đã kích hoạt');
    }
    const codeId = generateRandomSixDigits();
    const userRecord = this.usersRepository.create({
      ...userExist,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
      codeId: codeId,
    });
    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Active your account ✔', // Subject line
      template: 'register',
      context: {
        name: email,
        activationCode: codeId,
      },
    });
    return await this.usersRepository.update(userExist.id, userRecord);
  }

  async checkMail(data: forGotPasswordDto) {
    const { email } = data;
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    const codeId = generateRandomSixDigits();
    const userRecord = this.usersRepository.create({
      ...user,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
      codeId: codeId,
    });
    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Reset Password ✔', // Subject line
      template: 'register',
      context: {
        name: email,
        activationCode: codeId,
      },
    });
    return await this.usersRepository.update(user.id, userRecord);
  }

  async resetPassword(data: resetPasswordDto) {
    const { email, password, code } = data;

    const user = await this.usersRepository.findOne({
      where: { email, codeId: code },
    });
    if (!user) throw new BadRequestException('Mã code không hợp lệ');
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      const hashPass = hashPassword(password);
      const userUpdate = this.usersRepository.create({
        ...user,
        password: hashPass,
      });
      return await this.usersRepository.update(user.id, userUpdate);
    } else {
      throw new BadRequestException('Thời gian mã code đã hết hạn');
    }
  }
  //
}

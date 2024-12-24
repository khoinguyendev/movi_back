import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/User';
import { comparePassword } from 'src/helpers/util';
import { UsersService } from 'src/modules/users/users.service';
import {
  CreateAuthDto,
  forGotPasswordDto,
  getCodeDto,
  resetPasswordDto,
  verifyAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !comparePassword(pass, user.password)) return null;
    //Nó lấy user này gắn vào resquest chạy qua hàm login
    return user;
  }

  // Tao token tra ve cho client gom username va sub

  async login(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      username: user.username,
      avatar: user.avatar,
      phone: user.phone,
    };
    return {
      user: {
        email: user.email,
        id: user.id,
        role: user.role,
        username: user.username,
        avatar: user.avatar,
        phone: user.phone,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(registerDto: CreateAuthDto) {
    return await this.usersService.register(registerDto);
  }
  async verify(registerDto: verifyAuthDto) {
    return await this.usersService.verify(registerDto);
  }

  async getCode(data: getCodeDto) {
    return await this.usersService.getCode(data);
  }
  async checkMail(data: forGotPasswordDto) {
    return await this.usersService.checkMail(data);
  }
  async resetPassword(data: resetPasswordDto) {
    return this.usersService.resetPassword(data);
  }

  async getProfile(id: number) {
    return await this.usersService.findOne(id);
  }
}

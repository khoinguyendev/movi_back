import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CustomUnauthorizedException } from 'src/helpers/customError';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // login chay vao day truowc
  // dang nhap thanh cong lay user gan vao request
  async validate(email: string, password: string): Promise<any> {
    console.log('a');
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException('Email hoặc password không đúng');
    }
    if (user.isActive === false) {
      throw new CustomUnauthorizedException(
        'Tài khoản chưa được kích hoạt',
        user.id,
        401,
      );
    }
    return user;
  }
}

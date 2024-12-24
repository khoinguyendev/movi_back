import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from 'src/decorator/customize';
import {
  CreateAuthDto,
  forGotPasswordDto,
  getCodeDto,
  resetPasswordDto,
  verifyAuthDto,
} from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public() // khong can token
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Successfully logged in')
  login(@Request() req) {
    return this.authService.login(req.user);
  }
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(+req.user.id);
  }
  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }
  @Post('verify')
  @Public()
  verify(@Body() registerDto: verifyAuthDto) {
    return this.authService.verify(registerDto);
  }
  @Post('getcode')
  @ResponseMessage('Successfully')
  @Public()
  getCode(@Body() data: getCodeDto) {
    return this.authService.getCode(data);
  }
  @Get('mail')
  @Public()
  getMail() {
    this.mailerService.sendMail({
      to: 'nguyen12012k1@gmail.com', // list of receivers
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      template: 'register',
      context: {
        name: 'nguyen12012k1',
        activationCode: '123456',
      },
    });
    return 'ok';
  }
  @Post('checkmail')
  @Public()
  checkMail(@Body() data: forGotPasswordDto) {
    return this.authService.checkMail(data);
  }
  @Post('resetpassword')
  @Public()
  resetPassword(@Body() data: resetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}

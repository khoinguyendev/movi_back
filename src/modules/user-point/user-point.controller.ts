import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { CreateUserPointDto } from './dto/create-user-point.dto';
import { UpdateUserPointDto } from './dto/update-user-point.dto';

@Controller('user-point')
export class UserPointController {
  constructor(private readonly userPointService: UserPointService) {}

  @Post()
  create(@Request() req, @Body() createUserPointDto: CreateUserPointDto) {
    return this.userPointService.create(req.user, createUserPointDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.userPointService.findAll(req.user);
  }
  @Get('/get-points')
  getScore(@Request() req) {
    return this.userPointService.getScore(req.user);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPointService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserPointDto: UpdateUserPointDto,
  ) {
    return this.userPointService.update(+id, updateUserPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPointService.remove(+id);
  }
}

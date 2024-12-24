import { Module } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { UserPointController } from './user-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPoint } from 'src/entities/UserPoint';

@Module({
  imports: [TypeOrmModule.forFeature([UserPoint])],

  controllers: [UserPointController],
  providers: [UserPointService],
  exports: [UserPointService],
})
export class UserPointModule {}

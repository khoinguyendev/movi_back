import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from 'src/entities/Area';

@Module({
  imports: [TypeOrmModule.forFeature([Area])],

  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}

import { Module } from '@nestjs/common';
import { HallsService } from './halls.service';
import { HallsController } from './halls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from 'src/entities/Hall';
import { SeatsModule } from '../seats/seats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hall]), SeatsModule],
  controllers: [HallsController],
  providers: [HallsService],
  exports: [HallsService], // Make it available for other modules to use this service.
})
export class HallsModule {}

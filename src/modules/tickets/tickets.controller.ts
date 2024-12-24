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
import { TicketsService } from './tickets.service';
import { CreateTicketDto, FilterTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Public } from 'src/decorator/customize';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @Post()
  create(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(req.user, createTicketDto);
  }
  @Post('/zalo')
  createZalo(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createZalo(req.user, createTicketDto);
  }
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }

  @Public()
  @Post('/booked')
  findAllByShowtime(@Body() filterTicketDto: FilterTicketDto) {
    return this.ticketsService.findAllByShowtime(filterTicketDto);
  }
}

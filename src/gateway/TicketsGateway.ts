import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TicketsGateway {
  @WebSocketServer()
  server: Server;

  notifyTicketBooked(ticketData: any) {
    // console.log('Notifying clients about ticket booking:', ticketData); // Log the ticket data for debugging
    // Emit the event with showtimeId included
    this.server.emit('ticketBooked', {
      ...ticketData,
      showtimeId: ticketData.showtime.id, // Include showtimeId for filtering on the client side
    });
  }
}

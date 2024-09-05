import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger = new Logger('EventsGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug('Client disconnected: ' + client.id);
  }

  @SubscribeMessage('events')
  handleEvent() {}

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): WsResponse<unknown> {
    this.logger.debug('Message: ' + payload);
    this.server.emit('events', { client: client.id, payload });
    return { event: 'events', data: { client: client.id, payload } };
  }
}

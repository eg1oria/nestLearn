import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { SendMessageDto } from './dto/sendMessage.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('Conected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('dISConected', client.id);
  }

  @SubscribeMessage('send')
  async sendMessage(@MessageBody() dto: SendMessageDto) {
    const message = await this.chatService.sendMessage(dto);
    this.server.emit('messages', message);

    return message;
  }
}

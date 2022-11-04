import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WsEventsNamesEnum } from './enums';
import { IWebsocketClient } from './types';
import { InMemoryStorageService } from '../inmemory-storage/in-memory-storage.service';

export class BaseWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    protected readonly inMemoryStorage: InMemoryStorageService
  ) {}

  public afterInit(): void {}

  public async handleConnection(client: IWebsocketClient): Promise<void> {
    await this.inMemoryStorage.setConnection(client.id, client);
  }

  public async handleDisconnect(client: IWebsocketClient): Promise<void> {
    await this.inMemoryStorage.removeConnection(client.id);
  }

  public async clientEmit<TPayload>(clientId: string, event: WsEventsNamesEnum, payload: TPayload): Promise<void> {
    let clientSocketSessionId: string;
    try {
      clientSocketSessionId = await this.inMemoryStorage.getConnection(clientId).id;
      if (!clientSocketSessionId) {
        return;
      }
      this.server.to(clientSocketSessionId).emit(event, payload);
    } catch (error) {}
  }
}

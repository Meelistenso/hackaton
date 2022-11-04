import { UseFilters } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { BaseWsGateway } from '../base-ws-gateway';
import { WsEventsNamesEnum } from '../enums';
import { InvalidTokenExceptionFilter, WebsocketErrorExceptionFilter } from '../filters';
import { InMemoryStorageService } from '../../inmemory-storage/in-memory-storage.service';
import { IWebsocketClient } from '../types';

const wsOptions = {
  transports: ['websocket'],
  namespace: '/events',
  path: '/v1/websockets',
  serveClient: true,
};

@WebSocketGateway(wsOptions)
@UseFilters(new InvalidTokenExceptionFilter(), new WebsocketErrorExceptionFilter())
export class EventsWsGateway extends BaseWsGateway {
  constructor(
    protected readonly inMemoryService: InMemoryStorageService,
  ) {
    super(inMemoryService);
  }

  @SubscribeMessage(WsEventsNamesEnum.CHANGE_TILES)
  public changeTiles(@ConnectedSocket() client: IWebsocketClient): void {
    this.inMemoryService.updateConnection(client.id, client.data.tiles);
  }
}

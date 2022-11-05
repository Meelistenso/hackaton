import { UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { BaseWsGateway } from '../base-ws-gateway';
import { WsEventsNamesEnum } from '../enums';
import { InvalidTokenExceptionFilter, WebsocketErrorExceptionFilter } from '../filters';
import { InMemoryStorageService } from '../../inmemory-storage/in-memory-storage.service';
import { IWebsocketClient } from '../types';
import { dirAngle } from '../../../utils/vector';

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
  public changeTiles(
    @MessageBody() body,
    @ConnectedSocket() client: IWebsocketClient
  ): void {
    this.inMemoryService.updateConnection(client.id, { id: client.id, ...body });
  }

  @SubscribeMessage(WsEventsNamesEnum.GET_RIDE)
  public getRide(
    @MessageBody() body,
    @ConnectedSocket() client: IWebsocketClient
  ): void {
    const ride = this.inMemoryService.getRide(body.rideId);
    return {
      ...ride,
      direction: ride.length >= 2 ? dirAngle(
        { lat: ride[ride.length - 2].latitude, long: ride[ride.length - 2].longitude },
        { lat: ride[ride.length - 1].latitude, long: ride[ride.length - 1].longitude }
      ) : 0,
    }
  }
}

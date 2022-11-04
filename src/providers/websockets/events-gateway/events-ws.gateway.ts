import { UseFilters } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';

import { RedisService } from '../../redis/redis.service';
import { BaseWsGateway } from '../base-ws-gateway';
import { WsEventsNamesEnum, WsRoomsEnum } from '../enums';
import { InvalidTokenExceptionFilter, WebsocketErrorExceptionFilter } from '../filters';

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
    protected readonly redisService: RedisService,
  ) {
    super(redisService);
  }

  public adminsBroadcast<TPayload>(event: WsEventsNamesEnum, payload: TPayload): void {
    this.roomBroadcast<TPayload>(WsRoomsEnum.ADMINS, event, payload);
  }

  public clientsBroadcast<TPayload>(event: WsEventsNamesEnum, payload: TPayload): void {
    this.roomBroadcast<TPayload>(WsRoomsEnum.CLIENTS, event, payload);
  }
}

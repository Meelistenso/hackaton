import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { RedisPrefixEnum } from '../redis/enums';
import { RedisService } from '../redis/redis.service';
import { WsEventsNamesEnum, WsRoomsEnum } from './enums';
import { IWebsocketClient } from './types';

export class BaseWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly SESSION_EXPIRATION_TIME: number;

  constructor(
    protected readonly redisService: RedisService
  ) {}

  public afterInit(): void {}

  public async handleConnection(client: IWebsocketClient): Promise<void> {
    await this.saveSocketSessionToRedis(client.handshake.auth.userId, client);
  }

  public async handleDisconnect(client: IWebsocketClient): Promise<void> {
    await this.removeSocketSessionFromRedis(client.handshake.auth.userId, client);
  }

  public async clientEmit<TPayload>(userId: string, event: WsEventsNamesEnum, payload: TPayload): Promise<void> {
    let clientSocketSessionIds: string[] = [];
    try {
      clientSocketSessionIds = await this.getSocketSessionFromRedis(userId);
      if (!clientSocketSessionIds) {
        return;
      }
      for (const clientSocketSessionId of clientSocketSessionIds) {
        this.server.to(clientSocketSessionId).emit(event, payload);
      }
    } catch (error) {}
  }

  public async getSocketSessionFromRedis(userId: string): Promise<string[]> {
    return this.redisService.setMembers(`${RedisPrefixEnum.WEBSOCKETS}:${userId}`);
  }

  protected roomBroadcast<TPayload>(room: WsRoomsEnum, event: WsEventsNamesEnum, payload: TPayload): void {
    this.server.to(room).emit(event, payload);
  }

  private async saveSocketSessionToRedis(userId: string, client: IWebsocketClient): Promise<void> {
    const clientSocketSessionsKey = `${RedisPrefixEnum.WEBSOCKETS}:${userId}`;
    await this.redisService.setAdd(clientSocketSessionsKey, client.id);
    await this.redisService.setKeyTTLMs(clientSocketSessionsKey, this.SESSION_EXPIRATION_TIME);
    await this.redisService.setAdd(RedisPrefixEnum.WEBSOCKETS, userId);
  }

  private async removeSocketSessionFromRedis(userId: string, client: IWebsocketClient): Promise<void> {
    await this.redisService.setRemove(`${RedisPrefixEnum.WEBSOCKETS}:${userId}`, client.id);
  }
}

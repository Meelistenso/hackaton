import { Module } from '@nestjs/common';

import { RedisModule } from '../../redis/redis.module';
import { EventsWsGateway } from './events-ws.gateway';

@Module({
  imports: [RedisModule],
  providers: [EventsWsGateway],
  exports: [EventsWsGateway],
})
export class EventsWsModule {}

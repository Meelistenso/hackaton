import { Module } from '@nestjs/common';

import { EventsWsGateway } from './events-ws.gateway';
import { InMemoryStorageModule } from '../../inmemory-storage/in-memory-storage.module';

@Module({
  imports: [InMemoryStorageModule],
  providers: [EventsWsGateway],
  exports: [EventsWsGateway],
})
export class EventsWsModule {}

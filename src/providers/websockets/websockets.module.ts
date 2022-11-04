import { Module } from '@nestjs/common';

import { EventsWsModule } from './events-gateway/events-ws.module';

const modules = [EventsWsModule];

@Module({
  imports: modules,
  exports: modules,
})
export class WebsocketsModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubModule } from './providers/pubsub/pub-sub.module';
import { InMemoryStorageModule } from './providers/inmemory-storage/in-memory-storage.module';
import { WebsocketsModule } from './providers/websockets/websockets.module';

@Module({
  imports: [PubSubModule, InMemoryStorageModule, WebsocketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

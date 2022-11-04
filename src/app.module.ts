import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubModule } from './providers/pubsub/pub-sub.module';
import { InMemoryStorageModule } from './providers/inmemory-storage/in-memory-storage.module';

@Module({
  imports: [PubSubModule, InMemoryStorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

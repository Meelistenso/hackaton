import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubModule } from './providers/pubsub/pub-sub.module';

@Module({
  imports: [PubSubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

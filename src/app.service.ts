import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSubService } from './providers/pubsub/pub-sub.service';
import util from 'util';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(pubSubService: PubSubService) {
    pubSubService.subscribe(
      (message) => {
        console.log(message);
      },
      (error) => {
        console.error(util.inspect(error));
        process.exit(1);
      },
    );
  }

  onModuleInit() {
    console.log('On init');
  }

  getHello(): string {
    return 'Hello World!';
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSubService } from './providers/pubsub/pub-sub.service';
import util from 'util';
import { InMemoryStorageService } from './providers/inmemory-storage/in-memory-storage.service';
import { RideStatus } from './providers/inmemory-storage/enums';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly inMemoryStorage: InMemoryStorageService,
  ) {
    pubSubService.subscribe(
      (message) => {
        console.log(message);
        const { ride_id, ride_status, ...move } = message;
        switch (ride_status) {
          case RideStatus.DROPOFF:
            this.inMemoryStorage.finishRide(ride_id);
            break;
          case RideStatus.PICKUP:
            this.inMemoryStorage.setRide(ride_id, move, ride_status);
            break;
          case RideStatus.ENROUTE:
            this.inMemoryStorage.addMoveToRide(ride_id, move, ride_status);
        }
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

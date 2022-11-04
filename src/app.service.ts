import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSubService } from './providers/pubsub/pub-sub.service';
import util from 'util';
import { InMemoryStorageService } from './providers/inmemory-storage/in-memory-storage.service';
import { RideStatus } from './providers/inmemory-storage/enums';
import { BaseWsGateway } from './providers/websockets/base-ws-gateway';
import { WsEventsNamesEnum } from './providers/websockets/enums';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly inMemoryStorage: InMemoryStorageService,
    private readonly baseWsGateway: BaseWsGateway,
  ) {
    pubSubService.subscribe(
      this.onMessage.bind(this),
      (error) => {
        console.error(util.inspect(error));
        process.exit(1);
      },
    );
  }

  onMessage(message) {
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
    const clients = this.inMemoryStorage.getAllConnections();
    clients.forEach((client) => {
      this.baseWsGateway.clientEmit(client.id, WsEventsNamesEnum.UPDATE_RIDE, message);
    });
  }

  onModuleInit() {
    console.log('On init');
  }

  getHello(): string {
    return 'Hello World!';
  }
}

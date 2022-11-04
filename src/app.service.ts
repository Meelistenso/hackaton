import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSubService } from './providers/pubsub/pub-sub.service';
import util from 'util';
import { InMemoryStorageService } from './providers/inmemory-storage/in-memory-storage.service';
import { RideStatus } from './providers/inmemory-storage/enums';
import { WsEventsNamesEnum } from './providers/websockets/enums';
import { EventsWsGateway } from './providers/websockets/events-gateway/events-ws.gateway';
import { tile2latLong } from './utils/tiles';
import { dirAngle } from './utils/vector';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly inMemoryStorage: InMemoryStorageService,
    private readonly eventsWsGateway: EventsWsGateway,
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
    if (clients) {
      clients.forEach((client) => {
        //console.log(client.tiles);
        const clientTopLeftTileCoords = tile2latLong(client.tiles.leftTop.x, client.tiles.leftTop.x, client.tiles.zoom)
        const clientBottomRightTileCoords = tile2latLong(client.tiles.rightBottom.x, client.tiles.rightBottom.x, client.tiles.zoom)
        if (
          message.latitude > clientTopLeftTileCoords.lat &&
          message.latitude < clientBottomRightTileCoords.lat &&
          message.longitude > clientTopLeftTileCoords.long &&
          message.longitude < clientBottomRightTileCoords.long
        ) {
          const ride = this.inMemoryStorage.getRide(ride_id);
          this.eventsWsGateway.clientEmit(client.id, WsEventsNamesEnum.UPDATE_RIDE, {
            ...message,
            direction: ride.length >= 2 ? dirAngle(
              { lat: ride[ride.length - 2].latitude, long: ride[ride.length - 2].longitude },
              { lat: ride[ride.length - 1].latitude, long: ride[ride.length - 1].longitude }
            ) : 0,
          });
        }
      });
    }
  }

  onModuleInit() {
    console.log('On init');
  }

  getHello(): string {
    return 'Hello World!';
  }
}

import { Injectable } from '@nestjs/common';
import { RideStatus } from './enums';

@Injectable()
export class InMemoryStorageService {
  private readonly connections = new Map();
  private readonly rides = new Map();

  constructor() {}

  public getConnection(socketId: string) {
    return this.connections.get(socketId);
  }

  public setConnection(socketId: string, data) {
    this.connections.set(socketId, data)
  }

  public updateConnection(socketId: string, data) {
    this.connections.has(socketId) ? this.connections[socketId] = data : this.setConnection(socketId, data);
  }

  public getRide(rideId: string) {
    return this.rides.get(rideId);
  }

  public setRide(rideId: string, move, status: RideStatus) {
    this.rides.set(rideId, {
      moves: [{
      ...move, timestamp: Date.now()
      }],
      status: status || RideStatus.ENROUTE,
    });
  }

  public addMoveToRide(rideId: string, move, status?: RideStatus) {
    if (this.rides.has(rideId)) {
      this.rides.get(rideId).moves.push({
        ...move,
        timestamp: Date.now(),
      });
    } else {
      this.setRide(rideId, move, status);
    }
  }

  public finishRide(rideId: string) {
    if (this.rides.has(rideId)) {
      this.rides.get(rideId).moves = [];
      this.rides.get(rideId).status = RideStatus.DROPOFF;
    }
  }
}

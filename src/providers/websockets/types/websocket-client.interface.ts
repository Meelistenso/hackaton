import { Socket } from 'socket.io';

export interface IWebsocketClient extends Socket {
  tiles: IWSMessage;
}

export interface IWSMessage {
  leftTop: {
    lat: number;
    lng: number;
  },
  rightBottom: {
    lat: number;
    lng: number;
  },
  zoom: number;
}

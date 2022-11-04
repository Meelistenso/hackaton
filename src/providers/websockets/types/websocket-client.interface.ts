import { Socket } from 'socket.io';

export interface IWebsocketClient extends Socket {
  tiles: IWSMessage;
}

export interface IWSMessage {
  leftTop: {
    x: number;
    y: number;
  },
  rightBottom: {
    x: number;
    y: number;
  },
  zoom: number;
}

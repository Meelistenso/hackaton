import { Socket } from 'socket.io';

import { IUserWsContext } from './user-ws-context.interface';

export interface IWebsocketClient extends Socket {
  auth: IUserWsContext;
}

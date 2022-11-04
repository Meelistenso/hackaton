import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

import { WsMessageTypesEnum } from '../enums';

@Catch(WsException)
export class WebsocketErrorExceptionFilter extends BaseWsExceptionFilter {
  constructor() {
    super();
  }

  catch(exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    client.emit('exception', {
      type: WsMessageTypesEnum.EXCEPTION,
      message: exception.message,
    });
  }
}

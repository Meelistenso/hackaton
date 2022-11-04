import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

import { LoggerService } from '../../../logger/logger';
import { WsMessageTypesEnum } from '../enums';

@Catch(WsException)
export class WebsocketErrorExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger: LoggerService;

  constructor() {
    super();
    this.logger = new LoggerService(WebsocketErrorExceptionFilter.name);
  }

  catch(exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    this.logger.debug(this.catch.name, 'exception', exception);
    client.emit('exception', {
      type: WsMessageTypesEnum.EXCEPTION,
      message: exception.message,
    });
  }
}

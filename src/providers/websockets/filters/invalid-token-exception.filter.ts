import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

import { WsMessageTypesEnum } from '../enums';

@Catch(UnauthorizedException)
export class InvalidTokenExceptionFilter extends BaseWsExceptionFilter {
  constructor() {
    super();
  }

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    client.emit('exception', {
      type: WsMessageTypesEnum.EXCEPTION,
      message: exception.message,
    });
  }
}

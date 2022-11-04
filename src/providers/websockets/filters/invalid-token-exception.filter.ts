import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

import { LoggerService } from '../../../logger/logger';
import { WsMessageTypesEnum } from '../enums';

@Catch(UnauthorizedException)
export class InvalidTokenExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger: LoggerService;

  constructor() {
    super();
    this.logger = new LoggerService(InvalidTokenExceptionFilter.name);
  }

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    this.logger.warn(this.catch.name, 'exception', exception);
    client.emit('exception', {
      type: WsMessageTypesEnum.EXCEPTION,
      message: exception.message,
    });
  }
}

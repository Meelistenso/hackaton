import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisOptions } from 'ioredis';

import { RedisService } from './redis.service';

const redisOptions = {
  host: process.env['REDIS_HOST'],
  port: +process.env['REDIS_PORT'],
  username: process.env['REDIS_USER'],
  password: process.env['REDIS_PASSWORD'],
};

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisOptions,
    }),
  ],
  providers: [
    RedisService,
    {
      provide: 'RedisOptions',
      useFactory: (): RedisOptions => {
        return redisOptions;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}

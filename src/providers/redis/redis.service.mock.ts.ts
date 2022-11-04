import { Provider } from '@nestjs/common';

import { RedisService } from './redis.service';
import Mock = jest.Mock;

const redisServiceMockFactory: Mock<Partial<RedisService>> = jest.fn(() => ({
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  key: jest.fn(),
  exists: jest.fn(),
  setAdd: jest.fn(),
  setRemove: jest.fn(),
  setMembers: jest.fn(),
  incrby: jest.fn(),
  decrby: jest.fn(),
}));

export const RedisServiceMock: Provider = {
  provide: RedisService,
  useFactory: redisServiceMockFactory,
};

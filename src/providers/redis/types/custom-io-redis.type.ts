import { Redis } from 'ioredis';

export type CustomIORedis = Redis & { connected: boolean; ready: boolean };

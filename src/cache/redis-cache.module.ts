import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: process.env['REDIS_HOST'],
        port: process.env['REDIS_PORT'],
        ttl: process.env['REDIS_TTL'],
        max: process.env['REDIS_MAX_ITEMS'],
      }),
    }),
  ],

  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}

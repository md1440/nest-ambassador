import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret', // TODO: store in ENV
      signOptions: { expiresIn: '1d' },
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  exports: [JwtModule],
})
export class SharedModule {}

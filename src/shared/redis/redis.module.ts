// src/redis-cache.module.ts
import { Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: await redisStore({
            socket: {
              host: 'redis-17909.c80.us-east-1-2.ec2.redns.redis-cloud.com',
              port: 17909,
            },
            username: 'default',
            password: 'ubV4gIQDjEbtNVU1uHPEdDXjvdI1OV4O',
          }),
          ttl: 60 * 1000, // milliseconds
        };
      },
    }),
  ],
  providers: [RedisService],
  controllers: [RedisController],
  exports: [CacheModule, RedisService],
})
export class RedisModule {}
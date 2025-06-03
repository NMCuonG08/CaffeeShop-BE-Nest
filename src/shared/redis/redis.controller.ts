import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  getHello(): string {
    return this.redisService.getGreeting();
  }

  @Get('test')
  async testCache() {
    // Set test cache
    await this.redisService.setCache('test-key', 'test-value', 30);

    // Get test cache
    const value = await this.redisService.getCache('test-key');

    return {
      message: 'Cache test completed',
      value,
      timestamp: new Date().toISOString()
    };
  }

  @Post('set/:key')
  async setValue(
    @Param('key') key: string,
    @Body('value') value: any,
    @Body('ttl') ttl?: number
  ) {
    await this.redisService.set(key, value, ttl || 60);
    return {
      success: true,
      message: `Set ${key} = ${JSON.stringify(value)}`,
      ttl: ttl || 60
    };
  }

  @Get('get/:key')
  async getValue(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    return {
      key,
      value,
      exists: value !== null
    };
  }

  @Delete('del/:key')
  async deleteValue(@Param('key') key: string) {
    await this.redisService.del(key);
    return {
      success: true,
      message: `Deleted key: ${key}`
    };
  }

  @Get('exists/:key')
  async checkExists(@Param('key') key: string) {
    const exists = await this.redisService.exists(key);
    return { key, exists };
  }

  @Get('ttl/:key')
  async getTTL(@Param('key') key: string) {
    const ttl = await this.redisService.ttl(key);
    return { key, ttl };
  }

  @Post('increment/:key')
  async increment(
    @Param('key') key: string,
    @Body('value') value?: number
  ) {
    const newValue = await this.redisService.increment(key, value || 1);
    return {
      key,
      value: newValue,
      message: `Incremented ${key} to ${newValue}`
    };
  }

  @Post('decrement/:key')
  async decrement(
    @Param('key') key: string,
    @Body('value') value?: number
  ) {
    const newValue = await this.redisService.decrement(key, value || 1);
    return {
      key,
      value: newValue,
      message: `Decremented ${key} to ${newValue}`
    };
  }

  @Delete('clear')
  async clearAll() {
    await this.redisService.clear();
    return {
      success: true,
      message: 'All cache cleared'
    };
  }

  @Post('mset')
  async setMultiple(
    @Body('data') data: Array<[string, any]>,
    @Body('ttl') ttl?: number
  ) {
    await this.redisService.mset(data, ttl);
    return {
      success: true,
      message: `Set ${data.length} key-value pairs`,
      ttl: ttl || 'default'
    };
  }

  @Post('mget')
  async getMultiple(@Body('keys') keys: string[]) {
    const values = await this.redisService.mget(keys);
    const result = keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});

    return {
      success: true,
      data: result
    };
  }
}
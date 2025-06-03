import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async onModuleInit() {
    try {
      // Test connection
      await this.cacheManager.set('health-check', 'ok', 5000);
      const result = await this.cacheManager.get('health-check');

      if (result === 'ok') {
        console.log('✅ Redis connection successful!');
        await this.cacheManager.del('health-check');
      } else {
        console.error('❌ Redis health check failed');
      }
    } catch (error) {
      console.error('❌ Redis connection error:', error.message);
    }
  }

  // Backward compatibility methods (từ controller cũ)
  getGreeting(): string {
    return 'Redis Service is working!';
  }

  async setCache(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    return result !== undefined ? result : null;
  }

  // Standard cache methods
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    return result !== undefined ? result : null;
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async mget(keys: string[]): Promise<any[]> {
    // Fix: pass array instead of spread
    const results: any[] = [];
    for (const key of keys) {
      const value = await this.cacheManager.get(key);
      results.push(value);
    }
    return results;
  }

  async mset(keyValuePairs: Array<[string, any]>, ttl?: number): Promise<void> {
    // Fix: mset one by one since cache-manager might not support batch mset with TTL
    for (const [key, value] of keyValuePairs) {
      await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
    }
  }

  async clear(): Promise<void> {
    await this.cacheManager.clear();
  }

  async ttl(key: string): Promise<number> {
    try {
      const result = await this.cacheManager.ttl(key);
      return result ?? -1; // Return -1 if null/undefined
    } catch (error) {
      // Some cache managers don't support TTL
      return -1;
    }
  }

  // Wrapper method với auto-caching
  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    return await this.cacheManager.wrap(key, fn, ttl ? ttl * 1000 : undefined);
  }

  // Utility methods
  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined && value !== null;
  }

  async increment(key: string, value: number = 1): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const newValue = current + value;
    await this.set(key, newValue);
    return newValue;
  }

  async decrement(key: string, value: number = 1): Promise<number> {
    return this.increment(key, -value);
  }

  // Additional utility methods
  async getKeys(pattern?: string): Promise<string[]> {
    // This might not be supported by all cache managers
    // Return empty array as fallback
    return [];
  }

  async flush(): Promise<void> {
    await this.clear();
  }
}
// test/redis-performance.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../src/shared/redis/redis.module';
import { RedisService } from '../src/shared/redis/redis.service';

describe('Redis Performance Tests', () => {
  let service: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        RedisModule,
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  describe('Cache Performance', () => {
    it('should handle multiple concurrent operations', async () => {

      const startTime = Date.now();

      // Create 100 concurrent operations
      const promises = Array.from({ length: 100 }, (_, i) =>
        service.setCache(`key-${i}`, `value-${i}`, 60)
      );

      await Promise.all(promises);
      const setTime = Date.now() - startTime;

      // Read all values back
      const readStart = Date.now();
      const readPromises = Array.from({ length: 100 }, (_, i) =>
        service.getCache(`key-${i}`)
      );

      const results = await Promise.all(readPromises);
      const readTime = Date.now() - readStart;

      console.log(`Set 100 keys in ${setTime}ms`);
      console.log(`Read 100 keys in ${readTime}ms`);

      // Verify all values were set correctly
      results.forEach((value, index) => {
        expect(value).toBe(`value-${index}`);
      });

      // Performance assertions (adjust based on your requirements)
      expect(setTime).toBeLessThan(5000); // 5 seconds
      expect(readTime).toBeLessThan(2000); // 2 seconds
    });

    it('should handle large data objects', async () => {
      const largeObject = {
        id: 1,
        data: new Array(1000).fill(0).map((_, i) => ({
          index: i,
          value: `test-value-${i}`,
          timestamp: new Date().toISOString(),
        })),
      };

      const startTime = Date.now();
      await service.setCache('large-object', largeObject, 60);
      const setTime = Date.now() - startTime;

      const readStart = Date.now();
      const retrieved = await service.getCache('large-object');
      const readTime = Date.now() - readStart;

      console.log(`Set large object in ${setTime}ms`);
      console.log(`Read large object in ${readTime}ms`);

      expect(retrieved).toEqual(largeObject);
      expect(setTime).toBeLessThan(1000); // 1 second
      expect(readTime).toBeLessThan(500); // 0.5 seconds
    });

    it('should handle TTL correctly', async () => {
      const key = 'ttl-test-key';
      const value = 'ttl-test-value';
      const ttlSeconds = 2; // 2 seconds

      // Set cache with TTL
      await service.setCache(key, value, ttlSeconds);

      // Should exist immediately
      let cachedValue = await service.getCache(key);
      expect(cachedValue).toBe(value);

      // Wait for TTL + buffer
      await new Promise(resolve => setTimeout(resolve, (ttlSeconds + 1) * 1000));

      // Should be expired
      cachedValue = await service.getCache(key);
      expect(cachedValue).toBeUndefined();
    }, 10000); // Increase timeout for this test

    it('should handle cache miss gracefully', async () => {
      const nonExistentKeys = Array.from({ length: 50 }, (_, i) => `non-existent-${i}`);

      const startTime = Date.now();
      const promises: Promise<any>[] = nonExistentKeys.map(key => service.getCache(key));
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      console.log(`Handled 50 cache misses in ${totalTime}ms`);

      results.forEach(result => expect(result).toBeUndefined());
      expect(totalTime).toBeLessThan(2000); // 2 seconds
    });
  });
});
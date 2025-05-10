import { createClient } from 'redis';
import { logger } from '../utils/logger.util';

const redisClient = createClient({
  url: process.env.REDIS_HOST_URL || 'redis://localhost:6379',
});

redisClient.on('error', (error) => {
  logger.error(error, '[Redis] Error on connection:');
});

redisClient.on('connect', () => {
  logger.info('[Redis] Successfully connected');
});

redisClient.connect();

export async function setToCache(key: string, value: any, ttlSeconds: number = 1800): Promise<void> {
  const serialized = JSON.stringify(value);

  await redisClient.set(key, serialized, { EX: ttlSeconds });
}

export async function getFromCache<T = any>(key: string): Promise<T | null> {
  const value = await redisClient.get(key);

  return value ? JSON.parse(value) : null;
}

export async function deleteCache(key: string): Promise<void> {
  await redisClient.del(key);
}

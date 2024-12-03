import NodeCache from 'node-cache';
import { CONFIG } from '../config';

class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: CONFIG.cache.ttl });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  del(key: string): void {
    this.cache.del(key);
  }
}

export const cacheService = new CacheService();
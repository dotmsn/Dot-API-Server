import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async get(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async getJSON(key: string): Promise<any> {
    const data = await this.get(key);
    return JSON.parse(data);
  }

  async set(key: string, value: any) {
    await this.cache.set(key, value, 1000);
  }

  async setJSON(key: string, value: Record<string, any>) {
    const data = JSON.stringify(value);
    return this.set(key, data);
  }

  async reset() {
    await this.cache.reset();
  }

  async del(key: string) {
    await this.cache.del(key);
  }
}

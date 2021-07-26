import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/cache/redis-cache.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly cache: RedisCacheService,
    private readonly usersService: UsersService,
  ) {}

  public async createSession(id: string, token: string) {
    await this.cache.set('session_' + token, id);
  }

  public async getSession(token: string) {
    return await this.cache.get('session_' + token);
  }
}

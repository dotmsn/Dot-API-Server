import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../cache/redis-cache.service';
import _ from 'lodash';

@Injectable()
export class SessionService {
    constructor(private readonly cache: RedisCacheService) {}

    public async createSession(id: string, token: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};
        if (!data.tokens) data.tokens = [];
        data.tokens.push(token);

        await this.cache.setJSON('user:' + id, data);
    }

    public async isValidToken(id: string, token: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};
        const tokens = data.tokens || [];

        return tokens.includes(token);
    }

    public async invalidateToken(id: string, token: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};
        data.tokens = _.remove(data.tokens || [], token);

        await this.cache.setJSON('user:' + id, data);
    }

    public async invalidateAllTokens(id: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};
        data.tokens = [];
        await this.cache.setJSON('user:' + id, data);
    }
}

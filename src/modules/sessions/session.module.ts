import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { RedisCacheModule } from '../../cache/redis-cache.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RedisCacheModule, UsersModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

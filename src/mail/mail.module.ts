import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/cache/redis-cache.module';
import { MailService } from './mail.service';

@Module({
    imports: [RedisCacheModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}

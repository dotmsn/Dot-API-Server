import { Module } from "@nestjs/common";
import { SessionResolver } from './session.resolver';
import { SessionService } from "./session.service";
import { RedisCacheModule } from "src/cache/redis-cache.module";

@Module({
    imports: [RedisCacheModule],
    providers: [SessionResolver, SessionService],
    exports: [SessionService]
})
export class SessionModule {}

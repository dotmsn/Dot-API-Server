import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { CreateSessionDto } from "./dto/CreateSession.dto";
import Session from './session.interface';
import { User } from '../users/users.model';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class SessionResolver {
    constructor (
        private sessionService: SessionService
    ) {}

    @Mutation(() => Session)
    async createSession(@Args('payload') payload: CreateSessionDto): Promise<Session> {
        if (payload.email == "test@example.com" && payload.password == "12345678") {
            const session = new Session();
            session.accessToken = "HelloWorld";
            session.user = new User();
            session.user.displayName = "Sammwy";
            session.user.email = "test@example.com";
            return session;
        } else {
            throw new UnauthorizedException("INVALID_CREDENTIALS", "Credentials are invalid.");
        }
    }
}

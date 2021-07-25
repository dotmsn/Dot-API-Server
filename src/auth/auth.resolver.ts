import { SessionService } from './../modules/sessions/session.service';
import { AuthService } from './auth.service';
import { Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService
    ) {}
}

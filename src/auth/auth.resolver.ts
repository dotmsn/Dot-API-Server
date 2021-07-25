import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionService } from './../modules/sessions/session.service';
import { AuthService } from './auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import Session from 'src/modules/sessions/session.interface';
import { AuthLoginDto } from './dto/AuthLogin.dto';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService
    ) {}

    @Mutation(() => Session)
    public async login (@Args('payload') payload: AuthLoginDto): Promise<Session> {
        const user = await this.authService.validate(payload.email, payload.password);
        if (user) {
            const session = this.authService.login(user);
            return session;
        }

        throw new UnauthorizedException("INVALID_CREDENTIALS", "Invalid credentials.");
    }
}

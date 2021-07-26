import { AuthService } from './auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import Session from 'src/modules/sessions/session.interface';
import { AuthLoginDto } from './dto/AuthLogin.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Session)
  public async login(@Args('payload') payload: AuthLoginDto): Promise<Session> {
    const user = await this.authService.validate(
      payload.email,
      payload.password,
    );
    if (user) {
      const session = this.authService.login(user);
      return session;
    }

    throw new UnauthorizedException(
      'INVALID_CREDENTIALS',
      'Invalid credentials.',
    );
  }
}

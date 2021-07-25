import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionService } from "src/modules/sessions/session.service";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        private readonly usersService: UsersService,
        private readonly sessionService: SessionService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true
        });
    }

    async validate (request, validationPayload, done): Promise<void> {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        const user = await this.usersService.getByID(validationPayload.id);

        const id = await this.sessionService.getSession(token);
        const isValid = id == user._id;

        if (isValid) {
            done(null, user);
        } else {
            done(new UnauthorizedException('This session has expired'), null);
        }
    }
}

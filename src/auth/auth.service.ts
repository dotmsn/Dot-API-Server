import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/models/user';

import { UserService } from 'src/user/user.service';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) {}

    async validate(email: string, password: string): Promise<User | null> {
        const user = await this.userService.getByEmail(email);

        if (!user) {
            return null;
        }

        if (await bcrypt.compare(password, user.password)) {
            return user;
        } else {
            return null;
        }
    }

    login(user: User): { access_token: string; user: Record<string, string> } {
        const payload = {
            id: user._id,
        };

        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
        });

        this.sessionService.createSession(user._id, token);

        return {
            user: {
                email: user.email,
                username: user.username,
                id: user._id,
            },
            access_token: token,
        };
    }

    resolveIDFromToken(token: string): { id: string } {
        return this.jwtService.verify(token, {
            secret: process.env.JWT_TOKEN,
        });
    }

    /*    async verify(token: string): Promise<User> {
        console.log('ñañañañañañ');
        const decoded = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET,
        });

        const isValid = this.sessionService.isValidToken(decoded.id, token);

        if (!isValid) {
            return await this.userService.getByID(decoded.id);
        } else {
            return null;
        }
    }*/
}

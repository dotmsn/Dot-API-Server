import { SessionService } from './../modules/sessions/session.service';
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Session from "src/modules/sessions/session.interface";
import { User } from 'src/modules/users/users.model';
import { UsersService } from './../modules/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService
    ) {}

    public async validate(email: string, password: string): Promise<User | null> {
        const user = await this.userService.getByEmail(email);

        if (user && await user.comparePassword(password)) {
            return user;
        } else {
            return null;
        }
    }

    public login(user: User): Session {
        const payload = {
            id: user._id
        }

        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET
        });

        this.sessionService.createSession(user._id, token);
        return {
            accessToken: token,
            user: user
        }
    }
}

import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/models/user';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
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

    login(user: User): { access_token: string } {
        const payload = {
            id: user._id,
        };

        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
            }),
        };
    }

    async verify(token: string): Promise<User> {
        const decoded = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET,
        });

        const user = await this.userService.getByID(decoded.id);
        return user;
    }
}

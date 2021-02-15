import { Request } from 'express';
import {
    Controller,
    Post,
    Req,
    UseGuards,
    Get,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/user/models/user';
import { SessionService } from '../session/session.service';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @Req() req: Request,
    ): { access_token: string; user: Record<string, string | boolean> } {
        return this.authService.login(req['user'] as User);
    }

    @Get('logout')
    logout(@Req() req: Request) {
        const token = req.query['token'] as string;
        if (!token)
            return new BadRequestException(
                "Token wasn't provided on request query.",
            );
        else {
            const { id } = this.authService.resolveIDFromToken(token);
            this.sessionService.invalidateToken(id, token);
            return {
                success: true,
            };
        }
    }

    @Get('destroy')
    async destroy(@Req() req: Request) {
        const token = req.query['token'] as string;
        if (!token)
            return new BadRequestException(
                "Token wasn't provided on request query.",
            );
        else {
            const { id } = this.authService.resolveIDFromToken(token);
            const valid = await this.sessionService.isValidToken(id, token);
            if (valid) {
                this.sessionService.invalidateAllTokens(id);
                return {
                    success: true,
                };
            } else {
                return new UnauthorizedException();
            }
        }
    }

    @Get('validate')
    async validate(@Req() req: Request) {
        const token = req.query['token'] as string;
        if (!token)
            return new BadRequestException(
                "Token wasn't provided on request query.",
            );
        else {
            const { id } = this.authService.resolveIDFromToken(token);
            const valid = await this.sessionService.isValidToken(id, token);
            return { valid };
        }
    }
}

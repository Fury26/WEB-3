import { Controller, Post, UseGuards, Request, Get, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ok } from 'assert';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}


    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Request() req) {
        
        return this.authService.login(req.user);
        
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('protected')
    getProfile(@Request() req) {
        return {
            text: 'You passed jwt guard',
            user: req.user,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    @Post('token')
    async refresh(@Request() req) {
        
        const user = await this.usersService.findById(req.user.id);
        const newToken = await this.authService.updateToken(user);
        return {
            accessToken: newToken,
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout(@Request() req) {
        return await this.authService.logout(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    @Put('check')
    async check() {
        return true;
    }

}

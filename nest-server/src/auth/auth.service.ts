import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import {UsersService} from '../users/users.service'
import { RefreshToken } from './token.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,

        @InjectRepository(RefreshToken)
        private readonly tokensRepository: Repository<RefreshToken>
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        
        const user = await this.userService.findByEmail(email);
        
        if (user && user.password === pass) {
            const { password, ...result } = user;
            
            return result;
        }
        
    }

    async login(user: User) {
        
        const payload = { id: user.id };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.config.get('EXPIRES_IN')
        });

        const refreshToken = this.jwtService.sign(payload);
        const newToken = new RefreshToken(refreshToken, user.id);
        await this.tokensRepository.save(newToken);


        return {
            user,
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }

    async updateToken(user: User): Promise<string> {
        const payload = { id: user.id };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.config.get('EXPIRES_IN')
        });

        return accessToken;
    }

    async logout(userId: number) {
        const token = await this.tokensRepository.findOne({
            where: {
                user: userId
            }
        });
        return await this.tokensRepository.delete(token.token);
    }


}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.stategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from './token.entity';
import { Post } from 'src/posts/post.entity';
import { Follower } from 'src/relationsTables/followers.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, RefreshToken, Post, Follower]),
        PassportModule,
        ConfigModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('ACCESS_SECRET'),
                // signOptions: {
                //     expiresIn: config.get<string>('EXPIRES_IN'),
                // }
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, UsersService],
})
export class AuthModule {}

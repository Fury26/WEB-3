import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostsService } from './posts/posts.service';
import { ServeStaticModule } from '@nestjs/serve-static';

import * as path from 'path';

@Module({
  imports: [
      ServeStaticModule.forRoot({
        rootPath: path.join(__dirname, '/static'),
      }),
      TypeOrmModule.forRoot(config), 
      UsersModule, 
      PostsModule, 
      AuthModule,
      ConfigModule.forRoot(),
    ],
    controllers: [
      AppController, 
    ],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Follower } from 'src/relationsTables/followers.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment, Follower]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService]
})
export class PostsModule {}

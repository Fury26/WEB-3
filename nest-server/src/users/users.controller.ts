import { Body, Controller, Req, Get, Param, Post, Put, UseGuards, UseInterceptors, UploadedFile, Res, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor} from '@nestjs/platform-express'; 
import {Response} from 'express'
import * as path from 'path'
import * as fs from 'fs'

import { RequestDto } from 'src/helpers/interfaces';
import { Post as IPost } from 'src/posts/post.entity';
import { User } from './user.entity';
import { avatarDto, followDto } from './users.dto';
import { UsersService } from './users.service';
import { createPostData } from 'src/posts/posts.dto';

const root = path.dirname(require.main!.filename);

@Controller('user')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(':id/posts')
    async userPosts(@Param('id') id: number): Promise<IPost[]> {
        return await this.userService.posts(id);
    }


    @Get('username=:name')
    async getUsersByName(@Param('name') name: string) {
        return await this.userService.findByName(name);
    }


    @Post('follow')
    async follow(@Body() body: followDto) {
        return this.userService.follow(body.userId, body.follower);
    }


    @Post('unfollow')
    async unfollow(@Body() body: followDto) {
        return this.userService.unfollow(body.userId, body.follower);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('following')
    async getUserSubscribes(@Req() req: RequestDto) {
        return await this.userService.getSubcribes(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put()
    async updateUser(@Req() req: RequestDto, @Body() body: User) {
        body.id = req.user.id;
        return await this.userService.updateUser(body);
    }

    @UseGuards(AuthGuard('jwt'))
    // @UseInterceptors(AnyFilesInterceptor())
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
      ]))
    @Post('avatar')
    async updateAvatar(@UploadedFiles() files, @Req() req: RequestDto) {
        const id: number = req.user.id; 
        const avatar = files.avatar[0];

        if(!fs.existsSync(path.join(root, '/static', `/user_${id}`))) {
            fs.mkdirSync(path.join( root, '/static', `/user_${id}`));
        }

        fs.writeFileSync(path.join(root, `static/user_${id}/avatar.jpg`), avatar.buffer);
    }


    @Get('avatar/:id')
    async getAvatar(@Param('id') id: number, @Res() res: Response) {
        
        fs.readdir(path.join(root, `static/user_${id}`), (err, filenames) => {
            if(err) {
                res.status(404);
                return;
            }
            res.sendFile(path.join(root, `static/user_${id}/${filenames[0]}`));
        });
    }

}

import { Request, Controller, Get, HttpCode, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors, Put, Body, Param, Redirect, Res, Req } from '@nestjs/common';
import {AnyFilesInterceptor} from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import * as path from 'path'
import * as fs from 'fs';

const root = path.dirname(require.main!.filename);

import { PostsService } from './posts.service';
import { Post as IPost} from './post.entity'
import { createCommentDto, createPostBody, createPostData, followingPostsDto, userPostsDto } from './posts.dto';
import { RequestDto } from 'src/helpers/interfaces';
import { Comment } from './comment.entity';


@Controller('post')
export class PostsController {

    constructor(private readonly postService: PostsService) {}

    @Get()
    async findAll(): Promise<IPost[]> {
        return this.postService.findAll();
    }


    //TODO: 
    //WriteFile on the disk
    //fs and path does not works properly
    //make static folder
    //folder field must be updated after post created, to know it`s ID
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(AnyFilesInterceptor())
    async createPost(@Request() req: RequestDto, @UploadedFiles() files: createPostData[]) {
        let newPost = new IPost();

        const buffer = files.filter(f => f.fieldname === 'post-body')[0].buffer;
        if(!buffer) return;

        const body = <createPostBody><unknown>JSON.parse(buffer);
        
        newPost.text = body.text;
        newPost.datetime = new Date(body.datetime);
        newPost.hashtags = body.hashtags;
        newPost.user = {
            id: req.user.id,
        };
        newPost = await this.postService.create(newPost);

        
        const folder = path.join(root, newPost.folder);
        fs.mkdirSync(folder);

        for(const file of files) {
            if(file.fieldname === 'post-body') continue;
            fs.writeFileSync(path.join(folder, file.originalname), file.buffer);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('following')
    async getFollowingPosts(@Request() req, @Body() body: followingPostsDto) {
        const posts = await this.postService.getFollowingPosts(req.user.id, body.offset, body.count);
        posts.forEach(post => {
            const files = fs.readdirSync(path.join(root, post.folder));
            post.files = files;
        })

        return posts;
    }

    @Get('/:id/comments')
    async getPostComments(@Param('id') id: number) {
        
        return await this.postService.getPostComments(id);
    }


    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    @Post('/:id/comment')
    async createComment(@Param('id') id: number, @Request() req: RequestDto, @Body() body: createCommentDto) {
        
        const newComment = new Comment();
        newComment.text = body.text;
        newComment.user = req.user.id;
        newComment.post = id;

        return await this.postService.addPostComment(newComment);
    }

    @Get('/:id/image/:name')
    async getPostImage(
        @Param('id') postId: number,
        @Param('name') name: string,
        @Res() res: Response,
        ) {

            
        const folder = await this.postService.getPostFolder(postId);
        const image = path.join(root, folder, name);
        
        res.sendFile(image);
    }



    //working example of writing file
    @UseInterceptors(AnyFilesInterceptor())
    @Post('test') 
    async testupload(@UploadedFiles() file: createPostData[]) {
        fs.writeFileSync(path.join(root, '/avatar.png'), file[0].buffer);
    }


    @UseGuards(AuthGuard('jwt'))
    @Put()
    async getUserPost(@Req() req: RequestDto, @Body() body: userPostsDto) {
        const posts = await this.postService.getUserPosts(req.user.id, body.offset, body.count);
        posts.forEach(post => {
            const files = fs.readdirSync(path.join(root, post.folder));
            post.files = files;
        });

        return posts;
    }

}

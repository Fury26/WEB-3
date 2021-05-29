import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm'
import { In, Repository } from 'typeorm';
import * as path from 'path';


import { User } from 'src/users/user.entity';
import { Follower } from 'src/relationsTables/followers.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

const root = path.dirname(require.main!.filename);

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) 
        private readonly postsRepository: Repository<Post>,

        @InjectRepository(Comment) 
        private readonly commentsRepository: Repository<Comment>,

        @InjectRepository(User) 
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Follower) 
        private readonly followersRepository: Repository<Follower>) {}

    findAll(): Promise<Post[]> {
        return this.postsRepository.find();
    }

    async create(post: Post): Promise<Post> {
        post.folder = 'null';
        const newPost = await this.postsRepository.save(post);
        const folder = path.join(`./static/user_${post.user.id}/post_${newPost.id}`);

        const upd = await this.postsRepository.update(newPost.id!, {
            folder: folder,
        });
        newPost.folder = folder;
        return newPost;
    }

    async getPostFolder(postId: number): Promise<string> {
        const folder = (await this.postsRepository.find({
            select: ['folder'],
            where: {
                id: postId,
            },

        }))[0].folder;
        
        return folder;
    }


    async getFollowingPosts(userId: number, offset: number, count: number) {
        try {
            const following = await this.followersRepository.find({
                select: ['userId'],
                where: {
                    followerId: userId,
                }
            });

            const posts = await this.postsRepository.find({
                join: {
                    alias: 'post',
                    leftJoinAndSelect: {
                        user: 'post.user',
                    }
                },
                where: {
                    user: In(following.map(f => f.userId)),
                },
                take: count,
                skip: offset,
            });
            return posts;

        } catch (error) {
            console.log(error.message);
            
        }
    }


    async getUserPosts(id: number, offset: number, count: number) {
        const posts = await this.postsRepository.find({
            join: {
                alias: 'post',
                leftJoinAndSelect: {
                    user: 'post.user',
                }
            },
            where: {
                user: id,
            },
            take: count,
            skip: offset,
        });
        
        return posts;
    }

    async getPostComments(postId: number) {
        return await this.commentsRepository.find({
            join: {
                alias: 'c',
                leftJoinAndSelect: {
                    user: 'c.user',
                    post: 'c.post',
                }
            },
            where: {
                post: postId,
            }
        });
        
    }

    async addPostComment(comment: Comment) {
        return this.commentsRepository.save(comment);
    }

}

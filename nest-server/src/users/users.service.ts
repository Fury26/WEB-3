import { Body, Injectable, Put } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm'
import { Post } from 'src/posts/post.entity';
import { Follower } from 'src/relationsTables/followers.entity';
import { getRepository, ILike, QueryBuilder, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) 
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,

        @InjectRepository(Follower)
        private readonly followersRepository: Repository<Follower>
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }


    async findByEmail(email: string): Promise<User> {
        const arr = await this.usersRepository.find({
            select: ['id', 'email', 'password', 'bio', 'username'],
            where: {
                email: email,
            },
        });
        return arr[0];        
    }

    async findByName(name: string): Promise<User[]> {
        const u = await this.usersRepository.find({
            where: {
                username: ILike(`%${name}%`)
            }
        });
        return u;
        
    }

    async follow(toFollowId: number, followerId: number) {
        return await this.followersRepository
        .save(new Follower(toFollowId, followerId));
    }

    async unfollow(toUnfollowId: number, followerId: number) {
        return await this.followersRepository.delete({
            userId: toUnfollowId,
            followerId: followerId,
        })
    }


    findById(id: number): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    async posts(userId: number): Promise<Post[]> {
        const res = await this.postsRepository.find({
            join: {
                alias: 'post',
                leftJoinAndSelect: {
                    user: 'post.user',
                }
            },
            where: {
                user: userId,
            }
        })

        return res;
    }

    async getSubcribes(userId: number): Promise<User[]> {
        const f = await this.followersRepository.find({
            join: {
                alias: 'f',
                leftJoinAndSelect: {
                    user: 'f.user'
                }
            },
            where: {
                followerId: userId,
            }
        });
        return f.map(f => f.user);
    }

    async updateUser(user: User) {
        return this.usersRepository.update(user.id, user);
    }
   

}

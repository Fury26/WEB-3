import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Comment } from "src/posts/comment.entity";
import { Post } from "src/posts/post.entity";
import { Follower } from "src/relationsTables/followers.entity";


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    username?: string;

    @Column({
        type: 'text',
        nullable: false,
        select: false,
    })
    password?: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    email?: string;

    // @Column({
    //     type: 'text',
    //     nullable: true,
    // })
    // image?: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    bio?: string;


    @OneToMany(() => Post, post => post.user)
    posts?: Post[];


    @OneToMany(() => Comment, comment => comment.user)
    comments?: Comment[];


    @OneToMany(() => Follower, followers => followers.followerId)
    following?: number[];


    @OneToMany(() => Follower, followers => followers.userId)
    followers?: number[];
}
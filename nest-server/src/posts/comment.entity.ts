import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/users/user.entity";
import { Post } from "./post.entity";


@Entity('comments')
export class Comment {
    
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    text: string;
    

    @ManyToOne(() => User, user => user.id)
    user: number;

    @ManyToOne(() => Post, post => post.id)
    post: number;
}
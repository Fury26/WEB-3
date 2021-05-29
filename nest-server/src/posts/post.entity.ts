import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/users/user.entity";
import { Comment } from "./comment.entity";

@Entity('posts')
export class Post {


    //columns
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    text: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    hashtags?: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    folder?: string;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    datetime?: Date;


    files: string[];
    //foreign keys
    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => Comment, comment => comment.post)
    comments?: Comment[];


}
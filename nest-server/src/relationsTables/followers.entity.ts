import { User } from "src/users/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('followers')
export class Follower {

    constructor(userId, followerId) {
        this.userId = userId;
        this.followerId = followerId;
    }

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    followerId: number;

    @ManyToOne(() => User)
    @JoinColumn({name: "userId"})
    user: User;


    @ManyToOne(() => User)
    @JoinColumn({name: "followerId"})
    follower: User;
}
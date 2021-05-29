import { User } from "src/users/user.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";


@Entity('refresh_tokens')
export class RefreshToken {
    constructor(token: string, id: number) {
        this.token = token;
        this.user = id;
    }

    @PrimaryColumn({
        type: 'text',
        nullable: false,
    })
    token: string;


    @ManyToOne(() => User)
    user: number;
}
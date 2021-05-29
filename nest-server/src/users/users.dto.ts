export interface followDto {
    userId: number,
    follower: number,
}

export interface avatarDto {
    avatar: {
        fieldname: string,
        originalname?: string,
        mimetype?: string,
        size?: number,
        buffer?: Buffer,
        encoding?: string,
    }
}
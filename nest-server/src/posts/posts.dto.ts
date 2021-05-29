import { BaseEncodingOptions } from "fs";

export interface createPostData {
    fieldname: string,
    originalname?: string,
    mimetype?: string,
    size?: number,
    buffer?: string,
    encoding?: BaseEncodingOptions,
}

export interface createPostBody {
    text: string,
    hashtags?: string,
    datetime?: string, 
}

export interface followingPostsDto {
    count: number,
    offset: number,
}

export interface userPostsDto {
    count: number,
    offset: number,
}

export interface createCommentDto {
    text: string,
}
import {actionType, ADD_COMMENTS, ADD_FRIENDS_POST, ADD_USER_POST, SET_FRIENDS_POST} from "../types";
import {Post} from "../../models/Post";
import {IComment} from "../../models/Comment";


export interface postsState {
    isFriendsPostsLoaded: boolean,
    friendsPosts: Post[],
    discoverPosts: Post[],
    comments: IComment[],
    userPosts: Post[],
}

const initialState: postsState = {
    isFriendsPostsLoaded: false,
    friendsPosts: [],
    discoverPosts: [],
    comments: [],
    userPosts: [],
};

export const postsReducer = (state = initialState, action: actionType) => {
    switch (action.type) {
        case ADD_FRIENDS_POST: return {
            ...state,
            isFriendsPostsLoaded: true,
            friendsPosts: [...state.friendsPosts, ...action.payload],
        };
        case SET_FRIENDS_POST: return {
            ...state,
            isFriendsPostsLoaded: true,
            friendsPosts: action.payload,
        }
        case ADD_COMMENTS: return {
            ...state,
            comments: [...state.comments, ...action.payload],
        }
        case ADD_USER_POST: return {
            ...state,
            userPosts: [...state.userPosts, ...action.payload]
        }
        default: return state;
    }
}

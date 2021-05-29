import {mainServer} from "../../config";
import {ADD_COMMENTS, ADD_FRIENDS_POST, SET_TOKENS, dispatchType, ADD_USER_POST} from "../types";
import {checkToken} from "../../checkToken";
import {tokens} from "../../models/Tokens";
import {IComment} from "../../models/Comment";
import { setTokens } from "../authorization/authorizationActions";


export const addFriendsPosts = (id: number, offset: number, count: number, jwt: tokens) => {
    return async (dispatch: dispatchType) => {
        try {
            const actualJwt = await checkToken(jwt);
            

            if(!actualJwt) {
                return;
            }

            const response = await fetch(`${mainServer}/post/following`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${actualJwt.accessToken}`
                },
                body: JSON.stringify({
                    offset,
                    count,
                })
            });
            if(actualJwt.accessToken !== jwt.accessToken) {
                dispatch({type: SET_TOKENS,
                    payload: actualJwt});
            }
            if(!response) {
                alert('could`t load posts');
                return;
            }
            const json = await response.json();
            
            dispatch({
                type: ADD_FRIENDS_POST,
                payload: json,
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}

export const loadUserPosts = (offset: number, count: number, jwt: tokens) => {
    return async (dispatch: dispatchType) => {
        try {
            const actualJwt = await checkToken(jwt);
            if(!actualJwt) {
                return;
            }

            const response = await fetch(`${mainServer}/post`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${actualJwt.accessToken}`
                },
                body: JSON.stringify({
                    offset,
                    count,
                })
            });

            const posts = await response.json();
            dispatch({
                type: ADD_USER_POST,
                payload: posts,
            });

            if(actualJwt.accessToken !== jwt.accessToken) {
                dispatch({type: SET_TOKENS,
                    payload: actualJwt});
            }

        } catch(e) {

        }
    }
}


export const loadComments = (post_id: number) => {
    return async (dispatch: dispatchType) => {
        try {
            const response = await fetch(`${mainServer}/post/${post_id}/comments`, {
                method: 'GET',
            });
            const json = await response.json();
            
            dispatch({
                type: ADD_COMMENTS,
                payload: json,
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}

export const sendComment = (comment: IComment, token: tokens) => {
    return async (dispatch: dispatchType) => {
        try{
            if(!comment.post) {
                return;
            }

            const actualJwt = await checkToken(token);
            if(!actualJwt) {
                return;
            }

            const response = await fetch(`${mainServer}/post/${comment.post.id}/comment`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${actualJwt.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: comment.text,
                })
            });

            if(actualJwt.accessToken === token.accessToken) {
                dispatch(setTokens(actualJwt))
            }

            if(response.status !== 201) {
                return;
            }

            const com: IComment = {
                id: null,
                post: comment.post,
                postId: comment.post.id!,
                text: comment.text,
                user: comment.user,
                userId: comment.userId,

            }

            dispatch({
                type: ADD_COMMENTS,
                payload: [com],
            })


        } catch (e) {
            console.log(e.message);
        }
    }
}
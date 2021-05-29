import {
    dispatchType,
    SET_ALL_AUTH,
    SET_ID,
    SET_LOGINED,
    SET_REGISTER,
    SET_TOKENS,
    SET_USER,
    SET_USERNAME
} from "../types";
import {authServer, mainServer, storageName} from "../../config";
import {User} from "../../models/User";
import {tokens} from "../../models/Tokens";
import { checkToken } from "../../checkToken";


export const setUsername = (username: string) => ({
    type: SET_USERNAME,
    payload: username,
})

export const setId = (id: number) => ({
    type: SET_ID,
    payload: id,
})

export const setUser = (user: User) => ({
    type: SET_USER,
    payload: user,
})

export const setLogined = (payload: boolean) => ({
    type: SET_LOGINED,
    payload,
})

export const setTokens = (payload: tokens) => {
    const data = JSON.parse(localStorage.getItem(storageName)!);
    if(data) {
        data.tokens = {
            ...payload,
        }
        localStorage.setItem(storageName, JSON.stringify(data));
    }

    return {
        type: SET_TOKENS,
        payload,
    }
}

export const setAll = (payload: any) => ({
    type: SET_ALL_AUTH,
    payload,
});


export const login = (user: User) => {
    try {
        return async (dispatch: dispatchType) => {

            const response = await fetch(`${authServer}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if(response.status !== 200) {       
                return;
            }

            const json = await response.json();
            dispatch({
                type: SET_USER,
                payload: json.user,
            });
            dispatch({
                type: SET_LOGINED,
                payload: true,
            });
            dispatch(setTokens(json.tokens));
            localStorage.setItem(storageName, JSON.stringify({
                user: {
                    ...json.user,
                },
                tokens: {
                    ...json.tokens,
                }

            }));

            return user;

        }
    } catch (e) {
        console.log(e.message);
        return e;
    }
}
export const register = (user: User) => {
    try {
        return async (dispatch: dispatchType) => {
            const response = await fetch(`${authServer}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user),
            });
            if (response.status !== 200) {
                console.log('Bad request');
                return;
            }
            dispatch({
                type: SET_REGISTER,
                payload: false,
            });

            return user;
        }
    } catch (e) {
        console.log(e.message);
        return e;
    }
}

export const updateUser = (user: User, jwt: tokens) => {
    return async (dispatch: dispatchType) => {
        const actualJwt = await checkToken(jwt);
        if(!actualJwt) return;
        const response = await fetch(`${mainServer}/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${actualJwt.accessToken}`
            },
            body: JSON.stringify(user),
        });

        if(actualJwt.accessToken === jwt.accessToken) {
            dispatch(setTokens(actualJwt));
        }
        if(response.status === 200) {
            dispatch(setUser(user));
        }
    }
}
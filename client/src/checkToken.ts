import {authServer} from './config';
import {tokens} from "./models/Tokens";


export const checkToken = async (jwt: tokens): Promise<tokens | null> => {
    let check = await fetch(`${authServer}/auth/check`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${jwt.accessToken}`
        },
    });
    
    

    if(check.status === 200) {
        return jwt;
    }

    check = await fetch(`${authServer}/auth/token`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt.refreshToken}`
        },

    });


    if(check.status === 200) {
        
        const newToken = await check.json();
        
        
        return {
            accessToken: newToken.accessToken,
            refreshToken: jwt.refreshToken,
        };
    } else return null;
}
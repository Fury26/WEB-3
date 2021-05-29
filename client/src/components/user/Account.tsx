import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {BsUpload} from 'react-icons/bs';
import {mainServer} from "../../config";
import {setUser, updateUser} from "../../redux/authorization/authorizationActions";

import {AppState} from "../../redux/rootReducer";
import {User} from "../../models/User";
import { tokens } from "../../models/Tokens";
import UserPosts from "./UserPosts";
import { checkToken } from "../../checkToken";



type MapStateToPropsType = {
    user: User,
    avatar: string,
    tokens: tokens,
}

type MapDispatchToPropsType = {
    setUser(user: User): any,
    updateUser(user: User, jwt: tokens): any,
}

type AccountProps = MapStateToPropsType & MapDispatchToPropsType;


type StateType = {
    user: User,
    changeAvatarBtn: boolean,
    previewSrc: string | null,
    file: any,
    confirmChanges: boolean,
}


const Account: React.FC<AccountProps> = (props) => {
    const input = useRef<HTMLInputElement>(null);

    const defualtUserState: User = {
        id: props.user.id,
        username: props.user.username,
        bio: props.user.bio,
    }

    const [state, setState] = useState<StateType>({
        user: defualtUserState,
        changeAvatarBtn: false,
        previewSrc: null,
        file: null,
        confirmChanges: false,
    })

    useEffect(() => {
        let confirmChanges = false;
        if(state.user.username !== defualtUserState.username) confirmChanges = true;
        else if (state.user.bio !== defualtUserState.bio) confirmChanges = true;
        setState(prev => ({
            ...prev,
            confirmChanges: confirmChanges,
        }));

    }, [state.user])

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let changes: boolean;
        setState(prevState => ({
            ...prevState,
            user: {
                ...prevState.user,
                [event.target.name]: event.target.value
            },
            confirmChanges: changes,
        }));
    }

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const img = event.target.files![0];

        const reader = new FileReader();


        reader.readAsDataURL(img);
        reader.onload = () => {
            setState({
                ...state,
                file: img,
                previewSrc: reader.result!.toString(),
                changeAvatarBtn: true,
            })
        };

    }

    const changeAvatar = async () => {

        const actualJwt = await checkToken(props.tokens);
        
        if(!actualJwt) {
            return;
        }
        const formData = new FormData();
        formData.append(
            "avatar",
            state.file,
            state.file.name,
        );
        try {
            const response = await fetch(`${mainServer}/user/avatar`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${actualJwt.accessToken}`
                },
                body: formData,
            });
            

            if(response) {

            } else {
                alert('Something went wrong, try again');
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    const submitChanges = () => {
        try{
            props.updateUser(state.user, props.tokens);
            setState({
                ...state,
                confirmChanges: false,
            });

        }catch (e) {
            alert('Smth went wrong')
        }
    }

    const loadPhoto = () => {
        input.current!.click();
    }

    return (

        <div>
            <div className="account">
                <div className="account-image" >
                    <div className="image-wrapper">
                        { 
                        state.previewSrc || props.avatar ? 
                        <img className="rounded avatar" 
                        src={state.previewSrc ? state.previewSrc : props.avatar} alt="no avatar"/> :
                        <span>You don`t have avatar</span>
                        
                        }
                    <button className='btn upload-btn' onClick={loadPhoto}>
                        <BsUpload fontSize={30} style={{margin: 'auto'}}/></button>

                    </div>
                    <input ref={input} type="file" onChange={onChange} hidden={true}/>
                    { state.changeAvatarBtn ? <button className="btn btn-success mx-3" onClick={changeAvatar}>Change avatar</button> : null}

                </div>
                <div className="account-inputs d-flex flex-column justify-content-center">
                    <div className="mb-5">
                        <label htmlFor="inputUsername" className="form-label">Your username</label>
                        <input
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            id="inputUsername"
                            name="username"
                            value={state.user.username!}
                            onChange={inputHandler}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputBIO" className="form-label">BIO</label>
                        <input
                            placeholder="Write something about you"
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            id="inputBIO"
                            name="bio"
                            value={state.user.bio!}
                            onChange={inputHandler}/>
                    </div>
                    {state.confirmChanges ? <button onClick={submitChanges} className="btn btn-primary">Confirm Changes</button> : null}
                </div>
            </div>
            <UserPosts />
        </div>
    )
}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    user: state.auth.user,
    avatar: state.users.avatarSrc,
    tokens: state.auth.tokens,
});

const mapDispatchToProps: MapDispatchToPropsType = {
    setUser,
    updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
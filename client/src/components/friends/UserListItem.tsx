import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import {follow, unfollow} from '../../redux/users/usersAction'
import {setTokens} from '../../redux/authorization/authorizationActions'
import {connect} from "react-redux";
import {AppState} from "../../redux/rootReducer";
import {User} from "../../models/User";
import { checkToken } from "../../checkToken";
import { tokens } from "../../models/Tokens";
import { mainServer } from "../../config";
import {FaRegUserCircle} from "react-icons/fa"

type MapStateToPropsType = {
    thisUser: User,
    tokens: tokens,
}

type MapDispatchToPropsType = {
    follow(toFollow: User, whoFollowing: number): any,
    unfollow(toUnfollow: User, whoFollowed: number): any,
    setTokens(jwt: tokens): any,
}

type OwnProps = {
    user: User,
}

type UserListItemProps = MapStateToPropsType & OwnProps & MapDispatchToPropsType;


const UserListItem: React.FC<UserListItemProps> = (props) => {

    const [modal, setModal] = useState(false);
    const [avatar, setAvatar] = useState('');

    const followHandler = () => {
        props.follow(props.user, props.thisUser.id!);
    }

    const unFollowHandler = () => {
        props.unfollow(props.user, props.thisUser.id!);
    }

    const changeModal = () => {
        setModal(!modal);
    }

    const loadAvatar = async () => {
        console.log('load avatar', props.user);
        
        
        const response = await fetch(`${mainServer}/user/avatar/${props.user.id}`, {
            method: 'GET',
        });
        const image = await response.blob();

        const reader = new FileReader();
        reader.onload = () => {
            if(typeof reader.result === "string") {
                console.log('setting avatar', props.user.id);
                
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(image);
    }


    useEffect(() => {
        
        loadAvatar();
    }, []);


    // console.log('user avatar', props.user.id, ' ', avatar);
    

    return (
        <li className="list-group-item user-list-item" onClick={changeModal}>
            {
                avatar.length !== 0 ?
                <img className="user-list-avatar" src={avatar} />
                : 
                <div className="no-avatar">
                    <div className="no-avatar-icon"><FaRegUserCircle size={30} /></div>
                </div>
            }
            <span className="user-list-name"  >{props.user.username}</span>
            


            <Modal id={`user-view-modal-${props.user.id}`} display={modal} close={changeModal}>
                {
                    props.user.following ?
                        <button className="btn btn-primary m-3" onClick={unFollowHandler}>
                            UnFollow
                        </button> :
                        <button className="btn btn-primary m-3" onClick={followHandler}>
                            Follow
                        </button>
                }
                <button className="btn btn-info">View Page</button>
            </Modal>
        </li>
    )
}

const mapStateToProps = (state: AppState) => ({
    thisUser: state.auth.user,
    tokens: state.auth.tokens,
})

const mapDispatchToProps = {
    follow,
    unfollow,
    setTokens,
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(UserListItem);
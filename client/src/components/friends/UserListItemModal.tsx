import React, { useState } from 'react';
import { connect } from 'react-redux';
import { tokens } from '../../models/Tokens';
import { User } from '../../models/User';
import { AppState } from '../../redux/rootReducer';
import { follow, unfollow } from '../../redux/users/usersAction';
import { setTokens } from '../../redux/authorization/authorizationActions';
import { mainServer } from '../../config';
import { FaRegUserCircle } from 'react-icons/fa';
import { useEffect } from 'react';


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
    user: User;
}

type PropsType = MapStateToPropsType & MapDispatchToPropsType & OwnProps;



const UserListItemModal: React.FC<PropsType> = (props) => {

    const [avatar, setAvatar] = useState('');
    const [show, setShow] = useState(false);

    const followHandler = () => {
        props.follow(props.user, props.thisUser!.id!);
    }

    const unFollowHandler = () => {
        props.unfollow(props.user, props.thisUser!.id!);
    }

    const loadAvatar = async () => {
        
        const response = await fetch(`${mainServer}/user/avatar/${props.user.id}`, {
            method: 'GET',
        });
        const image = await response.blob();

        const reader = new FileReader();
        reader.onload = () => {
            if(typeof reader.result === "string") {
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(image);
    }


    useEffect(() => {
        loadAvatar();
    }, []);

    return (

        <>
        <li onClick={() => setShow(!show)} className="list-group-item user-list-item" data-bs-toggle="modal" data-bs-target={`#userlistmodal-${props.user.id}-${props.user.following}`} >
        {
                avatar.length !== 0 ?
                <img className="user-list-avatar" src={avatar} />
                : 
                <div className="no-avatar">
                    <div className="no-avatar-icon"><FaRegUserCircle size={30} /></div>
                </div>
            }
            <span className="user-list-name"  >{props.user.username}</span>

            {
                true ? <div className="modal fade"  id={`userlistmodal-${props.user.id}-${props.user.following}`}  tabIndex={-1} aria-labelledby={`userlistmodal-${props.user.id}-${props.user.following}`}
                    aria-hidden="true">
                <div className="modal-dialog modal-xs modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`userlistmodalheader-${props.user.id}-${props.user.following}`}>{props.user!.username}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                        </div>
                        <div className="modal-body w-100">

                        {
                        props.user.following ?
                            <button className="btn btn-primary m-3" onClick={unFollowHandler} data-bs-dismiss="modal">
                                UnFollow
                            </button> :
                            <button className="btn btn-primary m-3" onClick={followHandler} data-bs-dismiss="modal">
                                Follow
                            </button>
                        }
                        <button className="btn btn-info">View Page</button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div> : null}
            
        </li>
        </>
    )
}

const mapStateToProps = (state: AppState): MapStateToPropsType=> ({
    thisUser: state.auth.user,
    tokens: state.auth.tokens,
})

const mapDispatchToProps: MapDispatchToPropsType= {
    follow,
    unfollow,
    setTokens,
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(UserListItemModal);
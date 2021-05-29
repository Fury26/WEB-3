import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Post } from '../../models/Post';
import { tokens } from '../../models/Tokens';
import { loadUserPosts } from '../../redux/posts/postsAction';
import { AppState } from '../../redux/rootReducer';
import PreViewPost from '../posts/PreViewPost';
import {BsThreeDotsVertical} from 'react-icons/bs';

type MapStateToPropsType = {
    jwt: tokens,
    posts: Post[],

}
type MapDispatchToPropsType = {
    loadPosts(offset: number, count: number, jwt: tokens): any,
}

type UserPropsType = MapStateToPropsType & MapDispatchToPropsType;

const UserPosts: React.FC<UserPropsType> = (props) => {

    const [postsLoaded, setPostsLoaded] = useState(false);

    useEffect(() => {
        //load user posts
        props.loadPosts(0, 300, props.jwt).then(() => setPostsLoaded(true));
    }, []);

    const renderPosts = (): JSX.Element[] => {
        return props.posts.map(post => {
            console.log('user post', post);
            
            return (
                <div  key={post.id} className="user-post">
                    <PreViewPost post={post} />
                    <button  className="btn options-btn"><BsThreeDotsVertical /></button>
                </div>
            )
        })
    }

    if(!postsLoaded) {
        return (
            <h5>Loading your posts...</h5>
        )
    }

    return (
        <div className="posts-grid users-posts-grid">
            {renderPosts()}
        </div>
    )
}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    jwt: state.auth.tokens,
    posts: state.posts.userPosts,
})

const mapDispatchToProps: MapDispatchToPropsType = {
    loadPosts: loadUserPosts,
    
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppState>(mapStateToProps, mapDispatchToProps)(UserPosts);
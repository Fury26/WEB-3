import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import {mainServer} from "../../config";
import {AppState} from "../../redux/rootReducer";
import PostContainer from "./PostContainer";
import {Post} from "../../models/Post";

type MapStateToPropsType = {
    id?: number,
}

type OwnProps = {
    post: Post,
}

type FriendsPostsProps = MapStateToPropsType & OwnProps;


type StateType = {
    image: string,
}


const PreViewPost: React.FC<FriendsPostsProps> = (props) => {
    const [state, setState] = useState<StateType>({
        image: ''
    });

    useEffect(() => {
        
        getImages().then();
    }, []);


    const getImages = async () => {
        try {
            const response = await fetch(`${mainServer}/post/${props.post.id}/image/${props.post.files![0]}`, {
                method: 'GET',
            });
            const data = await response.blob();
            const reader = new FileReader();
            reader.onload = () => {
                
                if(typeof reader.result === "string") {
                    
                    setState({image: reader.result});
                }
            }
            reader.readAsDataURL(data);

        } catch (e) {
            console.log(e.message);
        }
    }



    return (
        <div className="pre-view-post" data-bs-toggle="modal" data-bs-target={`#exampleModal-${props.post.id}`}>
            <div className="card m-auto" style={{width: '100%'}}>
                {state.image.length !== 0 ? <img src={state.image} className="card-img-top" alt="error" /> : null}
                <div className="modal fade"  id={`exampleModal-${props.post.id}`}  tabIndex={-1} aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{props.post.user!.username}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                            </div>
                            <div className="modal-body w-100">
                                <PostContainer post={props.post}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    id: state.auth.user.id!,
})



export default connect<MapStateToPropsType, null, OwnProps, AppState>(mapStateToProps, null)(PreViewPost);
import React from 'react';
import {AiFillHome, AiOutlinePlusCircle} from 'react-icons/ai';
import {FaUserFriends} from 'react-icons/fa';
import {RiAccountCircleFill} from 'react-icons/ri';
import { NavBarItem } from './NavBarItem';


const refs = {
    'posts': false,
    'friends': false,
    'create': false,
    'account': false,
}

const NavBar: React.FC = () => {

        Object.keys(refs).forEach(key => {
            if(window.location.pathname.includes(key)) {
                switch(key) {
                    case 'posts': refs.posts = true; break;
                    case 'friends': refs.friends = true; break;
                    case 'create': refs.create = true; break;
                    case 'account': refs.account = true; break;
                    default: break; 
                }
            }
        })


    return (
        <nav className="navbar navbar-expand-lg navbar-light " style={{backgroundColor: '#e2d9f3'}}>
            <div className="container-fluid purple-500 d-flex justify-content-around">
                <NavBarItem 
                    icon={AiFillHome}
                    text="Home"
                    href="/posts"
                    active={refs.posts}
                />
                <NavBarItem 
                    icon={FaUserFriends}
                    text="Friends"
                    href="/friends"
                    active={refs.friends}
                />
                <NavBarItem 
                    icon={AiOutlinePlusCircle}
                    text="Create"
                    href="/create"
                    active={refs.create}
                />
                <NavBarItem 
                    icon={RiAccountCircleFill}
                    text="Account"
                    href="/account"
                    active={refs.account}
                />
            </div>
        </nav>
    )
}

export default NavBar;
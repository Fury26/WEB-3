import React from 'react';
import { Icon } from '../Icon';
import {IconType} from 'react-icons';

type NavBarItemProps = {
    icon: IconType,
    href: string,
    active: boolean,
    text: string,

}

export const NavBarItem: React.FC<NavBarItemProps> = (props) => {

    let className = "nav-item";

    if(props.active) {
        className += " nav-active";
    }

    return (
        <div className={className}>
            <a className="nav-link" aria-current="page" href={props.href}>
                <div className="d-flex my-auto">
                    <Icon icon={props.icon}/>
                    <span className="ms-1">{props.text}</span>
                </div>
            </a>
        </div>
    )
}
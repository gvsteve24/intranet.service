import React, { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import MessageBoard from './pages/MessageBoard'; 
import profileImg from '../image/profile-default.png';
import solidStar from '../image/favorite.png';
import regStar from '../image/favorite-reg.png';
import msgImg from '../image/message-black.png';

const Profile = styled.div`
    width: 100%;
    height: 198px;
    display: grid;
    grid-template-columns: 60px auto 40px 40px;
    grid-template-rows: 60px 60px 78px;

    p {
        grid-column-start: 1;
        grid-column-end: 5;
        grid-row-start: 3;
        grid-row-end: 4;
        padding-left: 10px;
    }

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 5px;
    }
`;

const ProfileIcon = styled.div`
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url(${profileImg}) center center no-repeat;
    cursor: pointer;
    margin: 5px;
`;

const MessageIcon = styled.div`
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url(${msgImg}) center center no-repeat;
    margin: 0 20px;
    cursor: pointer;

    ${ p => 
        p.small && css`
            width: 30px;
            height: 30px;
            margin: 5px;
        `};
`;

const FavoriteIcon = styled.div`
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(${solidStar}) center center no-repeat;
    margin: 5px;
    cursor: pointer;

    ${ p => 
        p.favorite && css`
            background: url(${regStar}) center center no-repeat;
        `};
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`;

const Flex = styled.div`
    width: 140px;
    height: 60px;
    display: inline-flex;
    flex-flow: column nowrap;
    justify-content: center;
    padding-left: 10px;
    
    ${ p => p.main && css`
        span:not(:last-child) {
            font-weight: 600;
        }
    `}

    ${ p => p.center && css`
        grid-column-start: 1;
        grid-column-end: 5;
        grid-row-start: 2;
        grid-row-end: 3;

        span {
            text-decoration: underline;
        }
    `}
`;

export default function Users({user, favorites, setFavorite}) {    

    const handleFavorite = (id) => {
        setFavorite(id);
    }

    return (
        <div>
            <Grid>
                {user && user.map( user => {
                    let img64String;

                    if(user && user.avatar){
                        let TYPED_ARRAY = new Uint8Array(user.avatar.data);
        
                        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                            return data + String.fromCharCode(byte);
                        }, '');
                
                        let base64String = btoa(STRING_CHAR);
                
                        img64String = `data:image/png;base64, ${base64String}`;
                    }

                    return (<Profile key={user._id}>
                        {user.avatar ? <img alt="avatar" src={img64String}/> : <ProfileIcon/>}
                        <Flex main>
                            <span>{user.kr_name}({user.en_name})</span>
                            <span>{user.department}</span>
                        </Flex>
                        <Link to={{
                            pathname:"/messages",
                            state:{
                                message: true,
                                to: `${user.kr_name}(${user.en_name})`
                            }
                        }}><MessageIcon small/></Link>
                        <FavoriteIcon favorite={ favorites[user._id] === "true" ? true : false } onClick={() => handleFavorite(user._id)}/>
                        <Flex center>
                            <span>{user.email}</span>
                            <span>{user.phone}</span>
                        </Flex>
                        <p>{user.address}</p>
                    </Profile>)
                })}
            </Grid>
            <Route path="/messages"><MessageBoard/></Route>
        </div>
    )
}

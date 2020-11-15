import React from 'react';
import styled, { css } from 'styled-components/macro';
import moment from 'moment-timezone';
import profileImg from '../image/profile-default.png';
import starImg from '../image/favorite.png';
import regStar from '../image/favorite-reg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

library.add(faCircle, faPaperPlane);

const FavoriteIcon = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(${starImg}) center center / 20px 20px no-repeat;
    margin: 0 5px 0 10px;
    cursor: pointer;

    ${ p => 
        p.favorites && css`
            background: url(${regStar}) center center no-repeat;
        `};
`;

const ProfileIcon = styled.div`
    display: inline-block;
    width: 50px;
    height: 50px;
    margin: 10px 0px 20px 10px;
    background: url(${profileImg}) center center / 50px 50px no-repeat;
    position: relative;
    top: 6px;
    cursor: pointer;
`;

const MessageBox = styled.div`
    margin: 20px 0;
`;

const Flex = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 5px;
    }

    .bold {
        font-weight: 700;
    }

    ${p => p.message && css`
        width: 900px;
        height: 70px;
        margin: 0 auto;
    `};

    ${p => p.center && css`
        width: 720px;
        height: 50px;
        font-size: 14px;

        span:nth-child(2){
            font-weight: 600;
        }
        span:nth-child(3){
            font-weight: 600;
            width: 85%;
        }
        span:last-child{
            margin-left:36px;
        }
    `};

    ${p => p.date && css`
        min-width: 84px;
        width: 90px;

        div {
            font-size: 12px;
        }

        i {
            width: 80px;
            text-align: end;
        }
    `};
`;

const Messages = ({ me, messages, favorites, checkMessage, checkRead, toggleFavorites, loading }) => {
    const handleMessage = (name, content, id) => {
        checkMessage(name, content);
        checkRead(undefined, undefined, id);
    }

    const handleFavorites = (id) => {
        toggleFavorites(id);
    } 

    if(loading){
        return <h2>Loading...</h2>
    }

    return (
        <MessageBox>
            { messages.map( (message, index) => {
                let img64String;

                if(message && message.sender_avatar){
                    let TYPED_ARRAY = new Uint8Array(message.sender_avatar.data);
    
                    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                        return data + String.fromCharCode(byte);
                    }, '');
            
                    let base64String = btoa(STRING_CHAR);
            
                    img64String = `data:image/png;base64, ${base64String}`;
                }
                
                return (<Flex message key={index}>
                    {message.sender_avatar ? <img alt="avatar" src={img64String}/> : <ProfileIcon/>}
                    <Flex onClick={(e) => handleMessage(message.sender_kr_name, message.content, message._id)} center>
                        <FavoriteIcon favorites={ favorites[message._id] === "true" ? true : false } onClick={(e) => {
                            e.stopPropagation();
                            handleFavorites(message._id);
                            }}/>
                        <span>{message.sender_kr_name}</span>
                        <span>({message.sender_en_name})</span>
                        { message.recv_chk ? <span className="content">{message.content}</span> : <span className="content bold">{message.content}</span>}
                    </Flex>
                    <Flex date>
                        <div>{moment(message.createdAt).tz('Asia/Seoul').format("YY.MM.DD h:mm")}</div>
                        <i>{message.sender === me.user._id ? <FontAwesomeIcon icon="paper-plane"/> :<FontAwesomeIcon icon="paper-plane" flip="horizontal"/>}</i>
                    </Flex>
                </Flex>) 
                               
            })}
        </MessageBox>
    )
}

export default Messages;

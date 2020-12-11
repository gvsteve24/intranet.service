import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import Config from '../../config';
import axios from 'axios';
import AriaModal from 'react-aria-modal';
import { useForm } from 'react-hook-form';
import Users from '../Users';
import chevronDown from '../../image/chevron-down-black.png';
import zoom from '../../image/zoom.png';
import logoImg from '../../image/jazoo_logo_white.png';
import msgImg from '../../image/message.png';
import profileImg from '../../image/profile-default.png';
import { useHistory } from 'react-router-dom';

const Logo = styled.div `
    width: 160px;
    height: 30px;
    background-image: url(${logoImg});
    background-size: cover;
    background-position: center;
    cursor: pointer;
`;

const MessageIcon = styled.div `
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url(${msgImg}) center center / 40px 40px no-repeat;
    margin: 0 20px;
    cursor: pointer;
`;

const ProfileIcon = styled.div `
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url(${profileImg}) center center no-repeat;
    margin: 0 20px;
    position: relative;
    cursor: pointer;
`;

const Container = styled.div `
    width: 100vw;
    height: 100vh;
`;

const Header = styled.div `
    width: 100%;
    height: 80px;
    background-color: #666;
`;

const Wrapper = styled.div `
    width: 1000px;
    height: 100%;
    margin: 0 auto;

    ${p => 
        p.flex && css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `};

    h1 {
        font-size: 48px;
        color: #111;
    }

    select {
        display: inline-block;
        width: 190px;
        height: 42px;
        border: 1px solid #808080;
        border-radius: 5px;
        background-color: #f3f3f3;
        padding: 12px 40px 12px 10px;
        margin: 7px 10px 20px;
        font-size: 14px;
        -webkit-appearance: none;
        background-image: url(${chevronDown});
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: 1.5em auto, 100%;
    }

    select:required:invalid {
        color: #d0d0d0;
    }

    option {
        color: #111;
    }
`;

const StyledInput = styled.input`
    box-sizing: border-box;
    width: 300px;
    height: 42px;
    border: 1px solid #f3f3f3;
    border-radius: 5px;
    background-color: #0d334b;
    padding: 12px;
    margin-bottom: 12px;

    ::placeholder {
        font-size: 14px;
        color: #808080;
    }

    ${p => 
        p.half && css`
            width: 145px;
        `};
    ${p => 
        p.third && css`
            width: 93px;
        `};
    ${p => 
        p.white && css`
            width: 380px;
            background-color: #f3f3f3;
            border: 1px solid #808080;
            -webkit-appearance: none;
            background-image: url(${zoom});
            background-repeat: no-repeat, repeat;
            background-position: right .7em top 50%, 0 0;
            background-size: 1.8em auto, 100%;
            ::placeholder {
                color: #d0d0d0;
            }
        `};
`;

const Flex = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;

    form {
        position: relative;
        width: 380px;
        height: 55px;
    }

    form input[type=submit] {
        position: absolute;
        -webkit-appearance: none;
        border: none;
        border-radius: 8px;
        width: 3.5em;
        height: 3.1em;
        background-color: transparent;
        right: 0;
        cursor: pointer;
    }

    form span.alert {
        display: inline-flex;
        width: 100%;
        font-size: 10px;
        color: red;
        justify-content: flex-end;
        position: relative;
        top: -16px;
    }
`;

const Modal = styled.div`
    font-family: 'NanumSquare', sans-serif;
    
    img {
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 20px;
        position: relative;
        cursor: pointer;
    }

    .modal {
        position: absolute;
        top: 65px;
        right: calc(50% - 500px);
        width: 150px;
        height: 74px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        border-radius: 4px;
        box-shadow: rgba(0,0,0,.25) 0 0 4px 1px;
        background-color: #fff;  
    }

    .modal-item {
        font-size: 12px;
        line-height: 37px;
        max-width: 140px;
        border-radius: 4px;
        width: 140px;
        height: 37px;
        padding-left: 10px;
        cursor: pointer;
    }

    .modal-item:hover {
        background-color: #f3f3f3;
    }
`;

export default function UserBoard() {
    const [ user, setUser ] = useState([]);
    const [ currentUser, setCurrentUser ] = useState(undefined);
    const [ favorites, setFavorites ] = useState(new Map([]));
    const [ caution, setCaution ] = useState('');
    const { register, handleSubmit, errors } = useForm();
    const [ modalActive, setModalActive ] = useState(false);
    const [ img64String, setImg64String ] = useState('');
    const history = useHistory();

    const authHeader = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user && user.token){
            return {Authorization: `Bearer ${user.token}`};
        }else{
            return {};
        }
    }

    const fetchUsers = async (criteria, term) => {
        try {
            if(!criteria && !term){
                const response = await axios.get(`${Config.ORIGIN}/users`, {headers: authHeader()});

                setUser(response.data);

                return response.data;
            }else {
                const response = await axios.get(`${Config.ORIGIN}/users?${criteria}=${term}`, {headers: authHeader()});
                
                setUser(response.data);

                return response.data;
            }            
        } catch (error) {
            const resMessage = ( error.response && error.response.data && error.response.data.message ) || error.message || error.toString();

            setCaution(resMessage);    
        }
        
    }

    const filterUser = (e) => {
        const value = e.target.options[e.target.options.selectedIndex].value;
        if(value === '즐겨찾기')
            fetchUsers('favorites', value);
        else
            fetchUsers('department', value);
    }

    const getCurrentUser = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user)    return user;
        else    return undefined;
    }

    useEffect(() => {
        const user = getCurrentUser();

        if (user) {
            setCurrentUser(user);
            
            if(user.user && user.user.avatar){
                let TYPED_ARRAY = new Uint8Array(user.user.avatar.data);

                const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                    return data + String.fromCharCode(byte);
                }, '');

                let base64String = btoa(STRING_CHAR);

                let formatString = `data:image/png;base64, ${base64String}`;
                setImg64String(formatString);
            }
        }
    }, []);
    
    useEffect(()=>{
        fetchUsers();
        setFavorite();
    }, []);

    const customSubmit = (e) => {
        e.preventDefault();

        handleSubmit((data) => {        
            if(data.search && typeof data.search === "string"){
                // add criteria to seperate kr_name and en_name
                const rule = data.search.split('').indexOf('-') === -1 ? 'kr_name' : 'phone';

                fetchUsers(rule, data.search);
            }
        })(e);
    }

    const handleLogoClick = () => {
        history.push('/');
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        setCurrentUser(undefined);
        history.push('/');
    }

    const goProfilePage = () => {
        history.push('/profile');
    }

    const handleMessage = () => {
        history.push('/messages');
    }

    const activateModal = () => {
        setModalActive(true);
    }

    const deactivateModal = () => {
        setModalActive(false);
    }

    const AlternateLocationAriaModal = AriaModal.renderTo('#profile');

    const modal = modalActive
        ? <AlternateLocationAriaModal
            titleText="Modal now visible"
            onExit={deactivateModal}
            initialFocus="#profile"
            underlayClickExits={true}
            underlayStyle={{
                zIndex: 100,
                position: 'absolute',
                backgroundColor: 'transparent'
            }}
        >
            <div className="modal">
                <div className="modal-item" onClick={goProfilePage}>내 프로필 보기</div>
                <div className="modal-item" onClick={handleLogout}>로그아웃</div>
            </div>
        </AlternateLocationAriaModal>
        :false;

    const setFavorite = async (id) => {
        const response = await axios.patch(`${Config.ORIGIN}/users/${id}`, {}, {headers: authHeader()});
        if(response && response.data){
            const user = response.data;
            setFavorites(user.favorites);
        }
    }
    
    return (
        <Container>
            <Header>
                <Wrapper flex>
                    <Logo onClick={handleLogoClick}/>
                    <Modal id="profile">
                        {modal}
                        <MessageIcon onClick={handleMessage}/>
                        {img64String ? <img alt="avatar" src={img64String} onClick={activateModal}/> : <ProfileIcon onClick={activateModal}/>}
                    </Modal>
                </Wrapper>
            </Header>
            <div>
                <Wrapper>
                    <h1>조직원 정보</h1>
                    <Flex>
                        <select onChange={filterUser} name="category" required>
                            <option defaultValue="">선택하세요</option>
                            <option value="즐겨찾기">즐겨찾기</option>
                            <option value="연구소">연구소</option>
                            <option value="사업부">사업부</option>
                        </select>
                        <form onSubmit={customSubmit}>
                            <StyledInput white type="text" name="search" placeholder="검색어를 입력하세요(이름, 전화번호)" ref={register({ required: true })}/>
                            {errors.search && <span className="alert">이름 또는 전화번호를 입력하세요.</span>}
                            <input type="submit" value="  "/>
                        </form>
                    </Flex>
                    {caution && (<div>{caution}</div>)}
                    {currentUser && <Users setFavorite={setFavorite} user={user} favorites={favorites}/>}
                </Wrapper>
            </div>
        </Container>
    )
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import AriaModal from 'react-aria-modal';
import logoImg from '../../image/jazoo_logo_white.png'; 
import msgImg from '../../image/message.png';
import profileImg from '../../image/profile-default.png';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`;

const Header = styled.div`
    width: 100%;
    height: 80px;
    background-color: #666;
`;

const Wrapper = styled.div`
    width: 1000px;
    height: 100%;
    margin: 0 auto;

    ${p => 
        p.flex && css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `};

    ${p => 
        p.center && css`
        justify-content: center;    
    `};

    ${p => 
        p.column && css`
        flex-direction: column;
        align-items: center;
    `};

    h1 {
        font-size: 48px;
        color: #111;
    }

    div.content {
        font-size: 14px;
        display: flex;
        justify-content: center;
        width: 378px;
        height: 40px;
        margin: 10px auto;

        div.col-left{
            font-weight: 600;
            text-align: right;
            box-sizing: border-box;
            width: 94px;
            height: 40px;
            letter-spacing: -.1em;
            line-height: 40px;
            margin-right: 15px;
        }

        div.col-right {
            display: inline-block;
            box-sizing: border-box;
            width: 320px;
            height: 40px;
            line-height: 18px;
        }
    }

    &>a:first-child, input[type=submit]{
        font-size: 18px;
        margin-top: 30px;
        margin-right: 5px;
        padding: 10px;
        height: 44px;
    }

    &>a:first-child {
        padding-top: 0;
    }

    &>a:first-child input {
        font-size: 18px;
        padding: 10px;
        background-color: #808080;
        height: 44px;
    }

    span.alert {
        display: inline-flex;
        width: 100%;
        font-size: 10px;
        color: red;
        justify-content: flex-end;
        position: relative;
        top: -5px;
        margin: 0 -10px 0 0;
    }
`;

const Logo = styled.div`
    width: 160px;
    height: 30px;
    background-image: url(${logoImg});
    background-size: cover;
    background-position: center;
    cursor: pointer;
`;

const MessageIcon = styled.div`
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url(${msgImg}) center center / 40px 40px no-repeat;
    margin: 0 20px;
    cursor: pointer;
`;

const ProfileIcon = styled.div`
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url(${profileImg}) center center no-repeat;
    margin: 0 20px;
    position: relative;
    cursor: pointer;
`;

const StyledInput = styled.input`
    color: #fff;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    border: 1px solid #808080;
    border-radius: 8px;
    background-color: #111;
    padding: 12px;
    margin-bottom: 10px;

    ::placeholder {
        font-size: 14px;
        color: #808080;
    }

    ${p => 
        p.half && css`
            width: 140px;
            border: none;
        `};
    ${p => 
        p.third && css`
            width: 93px;
        `};
    ${p => 
        p.gray && css`
            background-color: #808080;
            color: #fff;
        `};
    ${p => 
        p.white && css`
            background-color: #f3f3f3;
            color: #000;
        `};
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

const ChangePass = () => {
    const [ img64String, setImg64String ] = useState('');
    const [ modalActive, setModalActive ] = useState(false);
    const { register, handleSubmit, errors, watch } = useForm();
    const history = useHistory();
    
    const authHeader = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user.token){
            return {Authorization: `Bearer ${user.token}`};
        }else{
            return {};
        }
    }
    
    useEffect(() => {
        const sessionUser = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if(user && user.token){
                return user;
            }else {
                return undefined;
            }    
        }

        const user = sessionUser();
        
        if(user.user && user.user.avatar) {
            let TYPED_ARRAY = new Uint8Array(user.user.avatar.data);
    
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                return data + String.fromCharCode(byte);
            }, '');
    
            let base64String = btoa(STRING_CHAR);
    
            let formatString = `data:image/png;base64, ${base64String}`;
            setImg64String(formatString);
        }
    }, []);
        
    const onSubmit = async (data) => {
        const response = await axios.patch('http://localhost:3000/users/password', data, { headers: authHeader() });

        if(response && response.data){
            window.alert(`Password changed (hashed: ${response.data.password})`);
            history.push('/profile');
        }
    }

    const handleLogoClick = () => {
        history.push('/');
    }
    
    const handleMessage = () => {
        history.push('/messages');
    }
    
    const goProfilePage = () => {
        history.push('/profile');
    }

    const AlternateLocationAriaModal = AriaModal.renderTo('#profile');
    
    const activateModal = () => {
        setModalActive(true);
    }
    
    const deactivateModal = () => {
        setModalActive(false);
    }
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        history.push('/');
    }

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
                    <h1>내 정보</h1>
                </Wrapper>
                <Wrapper flex column>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="content">
                            <div className="col-left">현재 비밀번호</div>
                            <div className="col-right">
                                <StyledInput white name="passwordCurrent" type="password" ref={register({required: true})}/>
                            </div>
                        </div>
                        <div className="content">
                            <div className="col-left">새 비밀번호</div>
                            <div className="col-right">
                                <StyledInput white name="password" type="password" ref={register({required: true})}/>
                            </div>
                        </div>
                        <div className="content">
                            <div className="col-left">비밀번호 확인</div>
                            <div className="col-right">
                                <StyledInput white name="passwordConfirm" type="password" ref={register({validate: value => value === watch("password")})}/>
                            </div>
                        </div>
                        {errors.passwordConfirm && <span className="alert">비밀번호가 일치하지 않습니다.</span>}
                        <Wrapper flex center>
                            <Link to="/profile"><StyledInput type="button" value="취소" half/></Link>
                            <StyledInput type="submit" value="저장" half/>
                        </Wrapper>
                    </form>
                </Wrapper>
            </div>
        </Container>
    )
}

export default ChangePass;
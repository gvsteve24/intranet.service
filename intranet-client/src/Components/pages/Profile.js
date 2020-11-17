import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import AriaModal from 'react-aria-modal';
import '../../styles/message.css';
import logoImg from '../../image/jazoo_logo_white.png'; 
import msgImg from '../../image/message.png';
import profileImg from '../../image/profile-default.png';

const prodURL = 'https://gvsteve24-intranet-service.herokuapp.com';

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
    
    img {
        width: 100px;
        height: 100px;
    }

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

        div.col-left{
            font-weight: 600;
            text-align: right;
            box-sizing: border-box;
            width: 94px;
            height: 40px;
            line-height: 40px;
            letter-spacing: -.1em;
        }

        div.col-right {
            display: inline-block;
            box-sizing: border-box;
            width: 320px;
            height: 40px;
            line-height: 18px;
            padding: 12px;
        }

        div.col-right.email {
            text-decoration-line: underline;
        }

    }

    &>a:first-child, &>a:last-child {
        font-size: 18px;
        margin: 30px 5px 100px 0;
        padding: 10px;
        height: 44px;
    }

    input {
        font-size: 18px;
        padding: 10px;
        height: 44px;
    }

`;

const StyledInput = styled.input`
    color: #fff;
    box-sizing: border-box;
    width: 300px;
    height: 40px;
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    background-color: #111;
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
    background: url(${profileImg}) center center / 50px 50px no-repeat;
    margin: 0 20px;
    position: relative;
    cursor: pointer;

    ${ p => p.main && css`
        width: 100px;
        height: 100px;
        background: url(${profileImg}) center center / 100px 100px no-repeat;
    `}
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

const UnregisterModal = ({ active, deactivateUnregisterModal, handleUnregister, caution }) => {
    const confirmUnregister = () => {
        handleUnregister();
    }

    const closeModal = () => {
        deactivateUnregisterModal();
    }

    return (
        <AriaModal
            titleText="controlled input"
            mounted={active}
            onExit={closeModal}
            verticallyCenter={true}
            underlayClickExits={true}
            dialogStyle={{
                width: '610px',
                height: '170px',
                position: 'absolute',
                top: 'calc(50% - 85px)',
                right: 'calc(50% - 305px)',
                backgroundColor: '#f3f3f3',
                boxShadow: 'rgba(0,0,0,.25) 0 0 4px 1px'
            }}
            underlayStyle={{
                zIndex: 100,
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
        >
            <form className="unregister-form">
                {caution ? <h3 className="modal-header">{caution}</h3> : <h3 className="modal-header">정말 회원 탈퇴하시겠습니까?</h3>}
                <StyledInput onClick={closeModal} type="button" value="취소" className="quit-unregister"/>
                <StyledInput onClick={confirmUnregister}type="button" value="확인"/>
            </form>
        </AriaModal>
    )
}

const Profile = () => {
    const [ currentUser, setCurrentUser ] = useState(false);
    const [ profile, setProfile ] = useState({});
    const [ img64String, setImg64String ] = useState('');
    const [ modalActive, setModalActive ] = useState(false);
    const [ unregisterModalActive, setUnregisterModalActive ] = useState(false);
    const [ caution, setCaution ] = useState('');

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
         
            if(user && user.token) {
                setCurrentUser(true);
                return user;
            } else {
                return null;
            }   
        }

        const user = sessionUser();

        setProfile(user.user);
        
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
        
    const AlternateLocationAriaModal = AriaModal.renderTo('#profile');

    const handleMessage = () => {
        history.push('/messages');
    }

    const handleLogoClick = () => {
        history.push('/');
    }

    const goProfilePage = () => {
        window.location.reload();
    }
    
    const activateModal = () => {
        setModalActive(true);
    }

    const activateUnregisterModal = () => {
        setUnregisterModalActive(true);
    }
    
    const deactivateModal = () => {
        setModalActive(false);
    }

    const deactivateUnregisterModal = () => {
        setUnregisterModalActive(false);
    }

    const handleUnregister = async () => {
        try{
            const response = await axios.delete(`${prodURL}/users/me`, {headers: authHeader()});

            if(response && response.data){
                setUnregisterModalActive(false);
                localStorage.removeItem("user");
                history.push('/');
            }
        }catch(error){
            const resMessage = (error.response && error.response.data && error.reponse.data.message ) || error.message || error.toString();
            setCaution(resMessage);
            setUnregisterModalActive(true);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        setCurrentUser(undefined);
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
    { profile.avatar ? <img alt="avatar" src={img64String}/> :
<ProfileIcon main/>}
                    <div className="content">
                        <div className="col-left">이메일</div>
                        <div className="col-right email">{currentUser && profile.email}</div>
                    </div>
                    <div className="content">
                        <div className="col-left">이름</div>
                        <div className="col-right">
                            <span>{currentUser && profile.kr_name}</span>
                            <span>&nbsp;({currentUser && profile.en_name})</span>
                        </div>
                    </div>
                    <div className="content">
                        <div className="col-left">주소</div>
                        <div className="col-right">{currentUser && profile.address}</div>
                    </div>
                    <div className="content">
                        <div className="col-left">전화번호</div>
                        <div className="col-right">{currentUser && profile.phone}</div>
                    </div>
                    <Wrapper flex center>
                        <Link to="/updateInfo"><StyledInput type="button" value="수정" half/></Link>
                        <Link to="/changePass"><StyledInput type="button" value="비밀번호 변경" half/></Link>
                    </Wrapper>
                    <div><StyledInput onClick={activateUnregisterModal} type="button" value="회원탈퇴" half gray/></div>
                </Wrapper>
            </div>
            <UnregisterModal active={unregisterModalActive} deactivateUnregisterModal={deactivateUnregisterModal} handleUnregister={handleUnregister} caution={caution}/>
        </Container>
    )
}

export default Profile;
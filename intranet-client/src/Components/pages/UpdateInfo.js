import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Config from '../../config';
import { Link, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import { useForm } from 'react-hook-form';
import AriaModal from 'react-aria-modal';
import logoImg from '../../image/jazoo_logo_white.png';
import msgImg from '../../image/message.png';
import chevronDown from '../../image/chevron-down-black.png';
import profileImg from '../../image/profile-default.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    form {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        label {
            position: absolute;
            top: 80px;
            right: 447px;
        }
    }

    .custom-file-upload {
        font-size: 10px;
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
    }

    input[type=file] {
        display: none;
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
            line-height: 18px;
            padding: 12px 0 12px 20px;
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

        div.col-right.department {
            padding: 0;
            select {
                width: 258px;
                border-radius: 8px;
            }
        }

        div.col-right.address {
            padding: 0;
            input {
                width: 260px;
                margin-left: 9px;
                margin-top: 5px;
                height: 33px;
                border: 1px solid #808080;
            }
        }

        div.col-right.phone {
            justify-content: flex-start;
            padding: 7px 6px;
            margin-left: 3px;
            input {
                width: 83.5px;
                height: 33px;
                margin-right: 5px;
                border: 1px solid #808080;
            }
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

    h1 {
        font-size: 48px;
        color: #111;
    }

    select {
        display: inline-block;
        width: 190px;
        height: 33px;
        border: 1px solid #808080;
        border-radius: 5px;
        background-color: #f3f3f3;
        padding: 6px 40px 6px 10px;
        margin: 5px 10px 5px 10px;
        font-size: 14px;
        color: #d0d0d0;
        -webkit-appearance: none;
        background-image: url(${chevronDown});
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: 1.5em auto, 100%;
    }

    option {
        color: #111;
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

const StyledInput = styled.input`
    color: #fff;
    box-sizing: border-box;
    width: 300px;
    height: 40px;
    border: 1px solid #f3f3f3;
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

const UpdateInfo = () => {
    const [ currentUser, setCurrentUser ] = useState(false);
    const [ profile, setProfile ] = useState({});
    const [ modalActive, setModalActive ] = useState(false);
    const [ img64String, setImg64String ] = useState('');
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    
    const authHeader = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user.token){
            return {Authorization: `Bearer ${user.token}`};
        }else{
            return {};
        }
    }

    const onSubmit = async (data) => {

        const formData = new FormData();
        if(data.avatar[0])    formData.append("avatar", data.avatar[0]);
        if(data.department)    formData.append("department", data.department);
        if(data.address)    formData.append("address", data.address);
        if(data.phone0 && data.phone1 && data.phone2)    formData.append("phone", `${data.phone0}-${data.phone1}-${data.phone2}`);

        const response = await axios.patch(`${Config.ORIGIN}/users/info`, formData, {headers: authHeader()});
        if(response && response.errors){
            alert(`${response.errors}:${response.message}`)
        }else if(response && response.data){
            let user = JSON.parse(localStorage.getItem("user"));
            
            user.user = response.data;
            localStorage.setItem("user", JSON.stringify(user));            
            
            setProfile(response.data);
            history.push('/profile');
        }
        
    }

    useEffect(() => {
        const sessionUser = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if(user && user.token){
                setCurrentUser(true);
                return user;
            }else{
                return null;
            }
        }
        
        const user = sessionUser();
        
        setProfile(user.user);

        if(user.user && user.user.avatar){
            let TYPED_ARRAY = new Uint8Array(user.user.avatar.data);
    
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                return data + String.fromCharCode(byte);
            }, '');
    
            let base64String = btoa(STRING_CHAR);
    
            let formatString = `data:image/png;base64, ${base64String}`;
            setImg64String(formatString);
        }
    }, [])
        
    const AlternateLocationAriaModal = AriaModal.renderTo('#profile');

    const handleLogoClick = () => {
        history.push('/');
    }

    const handleMessage = () => {
        history.push('/messages');
    }

    const goProfilePage = () => {
        history.push('/profile');
    }
    
    const activateModal = () => {
        setModalActive(true);
    }
    
    const deactivateModal = () => {
        setModalActive(false);
    }
    
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
                    <form onSubmit={handleSubmit(onSubmit)} method="post" encType="multipart/form-data">
                        { currentUser && profile.avatar ? <img alt="avatar" src={img64String}/> : <ProfileIcon main/>}
                        <label htmlFor="file-upload" className="custom-file-upload"><FontAwesomeIcon icon="arrow-circle-up" size="2x"/></label>
                        <input id="file-upload" type="file" name="avatar" ref={register}/>
                        <div className="content">
                            <div className="col-left">이메일</div>
                            <div className="col-right email">{ currentUser ? profile.email : ''}</div>
                        </div>
                        <div className="content">
                            <div className="col-left">이름</div>
                            <div className="col-right">
                                <span>{currentUser ? profile.kr_name : ''}</span>
                                <span>&nbsp;({currentUser ? profile.en_name : ''})</span>
                            </div>
                        </div>
                        <div className="content">
                            <div className="col-left">부서</div>
                            <Wrapper className="col-right department">
                                <select name="department" ref={register}>
                                    <option b defaultValue="" value="">부서</option>
                                    <option value="사업부">사업부</option>
                                    <option value="연구소">연구소</option>
                                </select>
                            </Wrapper>
                        </div>
                        <div className="content">
                            <div className="col-left">주소</div>
                            <div className="col-right address">
                                <StyledInput white half name="address" type="text" placeholder="주소" ref={register}/>
                            </div>
                        </div>
                        <div className="content">
                            <div className="col-left">전화번호</div>
                            <div className="col-right phone">
                                <StyledInput white third type="text" name="phone0" placeholder="전화번호" ref={register}/>
                                <StyledInput white third type="text" name="phone1" ref={register}/>
                                <StyledInput white third type="text" name="phone2" ref={register}/>
                            </div>
                        </div>
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

export default UpdateInfo;
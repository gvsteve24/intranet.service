import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Config from '../../config';
import AriaModal from 'react-aria-modal';
import { authHeader } from '../../service/auth';
import Messages from '../Messages';
import Pagination from '../Pagination';
import '../../styles/message.css';
import styled, { css } from 'styled-components/macro';
import logoImg from '../../image/jazoo_logo_white.png';
import msgImg from '../../image/message.png';
import msgImgRed from '../../image/message-read.png';
import chevronDown from '../../image/chevron-down-black.png';
import zoom from '../../image/zoom.png';
import profileImg from '../../image/profile-default.png';

const Container = styled.div `
    width: 100vw;
    height: 100vh;
`;

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

    ${ p => p.unread && css`
        background: url(${msgImgRed}) center center / 40px 40px no-repeat;
    `};
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

const Button = styled.button`
    font-family: 'NanumSquare', sans-serif;
    color: #fff;
    box-sizing: border-box;
    width: 300px;
    height: 50px;
    padding: 10px 27px;
    background-color: #111;
    border: 2px solid #fff;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: -0.06em;
    margin: 0 10px 0 5px;

    ${props => 
        props.primary && 
        css`
            background-color: #fff;
            color: #0d334b;
        `};
    
    ${props => 
        props.send && 
        css`
            width: 140px;
            height: 45px;
        `};
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
        margin: 0 5px;
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

const StyledInput = styled.input`
    box-sizing: border-box;
    width: 300px;
    height: 42px;
    border: 1px solid #f3f3f3;
    border-radius: 5px;
    background-color: #0d334b;
    padding: 12px;
    margin: 0 5px;

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

    ${p => 
        p.message && css`
            width: 405px;
            height: 40px;
            box-sizing: border-box;
            border: 1px solid #808080;
            border-radius: 8px;
            padding: 12px 77px 12px 10px; 
            background-color: #f3f3f3;
            margin: 0;
            ::placeholder {
                font-size: 14px;
                color: #d0d0d0;
                letter-spacing: -0.1em;
            }
    `};
`;

const Flex = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;

    form {
        position: relative;
        width: 389px;
        height: 42px;
    }

    form input[type=submit] {
        position: absolute;
        -webkit-appearance: none;
        border: none;
        border-radius: 8px;
        width: 3.5em;
        height: 3.1em;
        background-color: transparent;
        right: 3px;
        top: 0;
        cursor: pointer;
    }

    form span.alert {
        display: inline-flex;
        width: 100%;
        font-size: 10px;
        color: red;
        justify-content: flex-end;
        position: relative;
        top: -2px;
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
    }

    .modal-item:hover {
        background-color: #f3f3f3;
    }

    ${p => p.message && css`
        .modal {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            padding: 0 40px;
            box-shadow: none;
            width: 515px;
            height: 420px;
            top: 0;
            right: 0;
            background-color: #f3f3f3;
        }

        h3 {
            width: 100%;
            margin-left: -10px;
            margin-top: 30px;
        }

        label {
            line-height: 14px;
            font-size: 14px;
            width: 100px;
            text-align: end;
            margin-right: 10px;
        }

        ul {
            list-style: none;
        }

        input[type=submit] {
            font-size: 18px;
            color: #fff;
            font-weight: 600;
            line-height: 18px;
            width: 140px;
            height: 40px;
            box-sizing: border-box;
            padding: 10px 45px;
            background-color: #0d334b;
            border: 2px solid #fff;
            border-radius: 8px;
            letter-spacing: -0.1em;
            margin: 4px 0px 0px 377px;
        }

        .content {
            font-size: 14px;
            color: #000;
            width: 530px;
            height: 200px;            
            background-color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            margin: 10px 0 20px 0;
            box-sizing: border-box;
        }

        .content::placeholder {
            font-size: 14px;
            color: #d0d0d0;
            letter-spacing: -0.1em;
        }
    `};
`;

const MessageModalRead = ({active, readMessage, passSender, deactivateMessageModalRead, activateMessageModal}) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        passSender(data.to);
        deactivateMessageModalRead();
        activateMessageModal();
    }

    return (
        <AriaModal
            titleText="controlled input"
            mounted={active}
            onExit={deactivateMessageModalRead}
            verticallyCenter={true}
            underlayClickExits={true}
            initialFocus="#initialFocus"
            dialogStyle={{
                width: '610px',
                height: '420px',
                position: 'absolute',
                top: 'calc(50% - 210px)',
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
            <form onSubmit={handleSubmit(onSubmit)} className="message-form read">
                <h3 className="modal-header">쪽지 읽기</h3>
                <label>보낸 사람</label>
                <StyledInput message name="to" defaultValue={readMessage.sender} ref={register}/>
                <textarea name="content" className="content" disabled={true} defaultValue={readMessage.content} ref={register}/>
                <StyledInput id="initialFocus" type="submit" value="답장하기"/>
            </form>
        </AriaModal>
    )
}

const MessageModal = ({ active, suggestions, text, onTextChange, suggestionSelected, revealSuggestions, deactivateMessageModal }) => {
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = async data => {
        data.to = data.to.split('(')[0];

        const response = await axios.post(`${Config.ORIGIN}/messages`, data, {headers: authHeader()});

        if(response && response.data){
            closeModal();
            window.location.reload();
        }
    }

    const handleChange = (e) => {
        onTextChange(e);
    }

    const handleClick = (e) => {
        revealSuggestions(e);
    }

    const closeModal = () => {
        deactivateMessageModal();
    }

    return (
        <AriaModal
            titleText="controlled input"
            mounted={active}
            onExit={closeModal}
            verticallyCenter={true}
            underlayClickExits={true}
            initialFocus="#initialFocus"
            dialogStyle={{
                width: '610px',
                height: '420px',
                position: 'absolute',
                top: 'calc(50% - 210px)',
                right: 'calc(50% - 305px)',
                backgroundColor: '#f3f3f3',
                boxShadow: 'rgba(0,0,0,.25) 0 0 4px 1px'
            }}
            underlayStyle={{
                zIndex: 100,
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
        >       <form onSubmit={handleSubmit(onSubmit)} className="message-form">
                    <h3 className="modal-header">쪽지 쓰기</h3>
                    <label>받는사람</label>
                    <StyledInput message value={text} name="to" placeholder="여러 명은 쉼표(,) 또는 세미콜론(;)으로 구분 (최대 10명)" onChange={handleChange} onClick={handleClick} ref={register({required: true})}/>
                    <ul className="hidden">
                        {suggestions.map((item, index) => <li key={index} onClick={() => suggestionSelected(item)}><span>{item}</span></li>)}
                    </ul>
                    <textarea name="content" className="content" id="initialFocus" placeholder="텍스트를 입력하세요" ref={register({required: true})}/>
                    { errors.content && <span className="aler t">내용을 입력하십시오</span> }
                    <StyledInput type="submit" value="보내기"/>
                </form>
        </AriaModal>
    )
}

export default function MessageBoard() {
    const [ messages, setMessages ] = useState([]);
    const [ favorites, setFavorites ] = useState(new Map([]));
    const [ loading, setLoading ] = useState(false);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ messagesPerPage ] = useState(10);
    const [ modalActive, setModalActive ] = useState(false);
    const [ messageModalActive, setMessageModalActive ] = useState(false);
    const [ readMessage, setReadMessage ] = useState({ sender: '', content: ''});
    const [ messageModalReadActive, setMessageModalReadActive ] = useState(false);
    const [ caution, setCaution ] = useState('');
    const [ user, setUser ] = useState([]);
    const [ img64String, setImg64String ] = useState('');
    const [ suggestions, setSuggestions ] = useState([]);
    const [ text, setText ] = useState('');
    const [ currentUser, setCurrentUser] = useState(undefined);
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const location = useLocation();
    
    const fetchMessages = async (criteria, term) => {
        try {
            if(term && typeof term === "string"){
                setLoading(true);
                const response = await axios.get(`${Config.ORIGIN}/messages?${criteria}=${term}`, {headers: authHeader()});

                setMessages(response.data);
                setLoading(false);
            }else{
                setLoading(true);
                const response = await axios.get(`${Config.ORIGIN}/messages`, {headers: authHeader()});
                setMessages(response.data);
                setLoading(false);
            }
        } catch (error) {
            const resMessage = ( error.response && error.response.data && error.response.data.message ) || error.message || error.toString();

            setCaution(resMessage);    
        }
        
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${Config.ORIGIN}/users`, {headers: authHeader()});
            setUser(response.data);
            
        } catch (error) {
            const resMessage = ( error.response && error.response.data && error.response.data.message ) || error.message || error.toString();

            setCaution(resMessage);    
        }
        
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        setCurrentUser(undefined);
        history.push('/');
    }

    const goProfilePage = () => {
        history.push('/profile');
    }
    
    const getCurrentUser = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user)    return user;
        else    return undefined;
    }

    const filterMessage = (e) => {
        const value = e.target.options[e.target.options.selectedIndex].value;
        fetchMessages('sort', value);                               // received or sent
    }
    
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

    const toggleFavorites = async (id) => {
        const response = await axios.patch(`${Config.ORIGIN}/users?message=${id}`, {}, { headers: authHeader() });
        if(response && response.data){
            const list = response.data.favMessages;
            setFavorites(list);
        }
    }

    useEffect(() => {
        const user = getCurrentUser();

        if(user) {
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
        toggleFavorites();
    }, []);

    useEffect(()=>{fetchMessages()}, []);
    useLayoutEffect(() => {
        if(location.state && location.state.message){
            setMessageModalActive(true);
            setText(location.state.to);
        }  
    }, [location.state])

    const handleLogoClick = () => {
        history.push('/');
    }

    const activateModal = () => {
        setModalActive(true);
    }

    const activateMessageModal = () => {
        setMessageModalActive(true);
    }

    const deactivateModal = () => {
        setModalActive(false);
    }

    const deactivateMessageModal = () => {
        setMessageModalActive(false);
    }

    const updateReadStatus = async (name, content, id) => {
        await axios.patch(`${Config.ORIGIN}/messages/${id}`, {}, { headers: authHeader() });
    }

    const checkMessage = (sender, content) => {
        activateMessageModalRead();
        setReadMessage({sender, content});
    }

    const activateMessageModalRead = () => {
        setMessageModalReadActive(true);
    }

    const deactivateMessageModalRead = () => {
        setMessageModalReadActive(false);
        // window.location.reload();                // this one gotta be alternative method to update read/unread message
    }

    const onTextChange = (e) => {
        setText(e.target.value);
        let namelist = [], filtered = [];

        user.forEach(user => {
            namelist.push(`${user.kr_name}(${user.en_name})`);
        })

        filtered = namelist.filter( name => name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1);
        setSuggestions(filtered);
    }

    const revealSuggestions = (e) => {
        let namelist = [];

        user.forEach(user => {
            namelist.push(`${user.kr_name}(${user.en_name})`);
        })

        setSuggestions(namelist);
    }

    const suggestionSelected = (value) => {
        setText(value);
        setSuggestions([]);
    }

    const passSender = (sender) => {
        setText(sender);
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

    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            <Header>
                <Wrapper flex>
                    <Logo onClick={handleLogoClick}/>
                    <Modal id="profile">
                        {modal}
                        <MessageIcon unread={false}/>
                        {img64String ? <img alt="avatar" src={img64String} onClick={activateModal}/> : <ProfileIcon onClick={activateModal}/>}
                    </Modal>
                </Wrapper>
            </Header>
            <div>
                <Wrapper>
                    <h1>전체 쪽지함</h1>
                    <Flex>
                        <select onChange={filterMessage} name="category">
                            <option value="">----</option>
                            <option value="received">받은 쪽지</option>
                            <option value="sent">보낸 쪽지</option>
                        </select>
                        <form onSubmit={customSubmit}>
                            <StyledInput white name="search" type="text" placeholder="검색어를 입력하세요(이름, 전화번호, 내용)" ref={register({required: true})}/>
                            {errors.search && <span className="alert">이름 또는 전화번호를 입력하세요.</span>}
                            <input type="submit" value="  "/>
                        </form>
                        <Button send onClick={activateMessageModal}>쪽지 보내기</Button>
                    </Flex>
                    {caution && <div>{caution}</div>}
                    {currentUser && <Messages me={currentUser} messages={currentMessages} favorites={favorites} checkRead={updateReadStatus} checkMessage={checkMessage} toggleFavorites={(id) => toggleFavorites(id)} loading={loading}/>}
                    <Pagination messagesPerPage={messagesPerPage} totalMessages={messages.length} paginate={paginate}/>
                </Wrapper>
            </div>
            <MessageModal active={messageModalActive} suggestions={suggestions} text={text} onTextChange={onTextChange} suggestionSelected={suggestionSelected} revealSuggestions={revealSuggestions} deactivateMessageModal={deactivateMessageModal}></MessageModal>
            <MessageModalRead active={messageModalReadActive} readMessage={readMessage} passSender={passSender} deactivateMessageModalRead={deactivateMessageModalRead} activateMessageModal={activateMessageModal}/>
        </Container>
    )
}
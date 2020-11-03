import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled, { css } from 'styled-components/macro';

const Button = styled.button`
    font-family: 'NanumSquare', sans-serif;
    color: #fff;
    box-sizing: border-box;
    width: 300px;
    height: 50px;
    padding: 15px 117px;
    background-color: #0d334b;
    border: 2px solid #fff;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: -0.06em;

    ${props => 
        props.primary && 
        css`
            background-color: #fff;
            color: #0d334b;
        `};
`;

const FormContainer = styled.div`
    font-family: 'NanumSquare', sans-serif;
    font-size: 18px;  
    color: #fff;
    display: flex;
    flex-flow: column;
    background-color: #0d334b;
    box-sizing: border-box;
    width: 520px;
    height: 710px;
    padding: 75px 110px 30px 110px;

    h3 {
        width: 100%;
        text-align: left;
        font-size: 36px;
        margin: 0;
    }
    
    form {
        box-sizing: border-box;
        width: 300px;
        margin-top: 20px;
    }

    input {
        color: #fff;
        font-size: 14px;
        box-sizing: border-box;
        width: 300px;
        height: 40px;
        border: 1px solid #f3f3f3;
        border-radius: 5px;
        background-color: #0d334b;
        padding: 12px;
        margin-bottom: 10px;
    }

    input::placeholder {
        font-size: 14px;
        color: #808080;
    }

    input[type=checkbox] {
        width: 14px;
        height: 14px;
        margin: 0;
    }

    label {
        font-size: 14px;
        position: relative;
        bottom: 2px;
        left: 5px;
    }

    input[type=submit] {
        font-size: 18px;
        color: #0d334b;
        font-weight: 600;
        line-height: 18px;
        width: 300px;
        height: 50px;
        box-sizing: border-box;
        margin-top: 40px;
        padding: 15px 117px;
        background-color: #fff;
        border: 2px solid #fff;
        border-radius: 5px;
        letter-spacing: -0.1em;
    }

    span {
        display: inline-flex;
        width: 100%;
        justify-content: center;
        margin-bottom: 140px;
    }

    span.alert {
        font-size: 10px;
        color: red;
        justify-content: flex-end;
        position: relative;
        top: -5px;
        margin: 0 -10px 0 0;
    }

    a {
        color: #fff;
        font-size: 14px;
        text-decoration-line: underline;
        text-decoration-color: #fff;
    }

    div {
        display: flex;
        justify-content: center;
    }

    p {
        font-size: 5px;
        color: #f3f3f3;
        margin-top: 80px;
        padding: 0 auto;
        box-sizing: border-box;
    }
`;

export default function Login(props) {
    const [ caution, setCaution ] = useState(''); 
    const { register, handleSubmit, errors } = useForm();
    
    let history = useHistory();
    
    const onSubmit = async data => {
        try{
            const response = await axios.post('http://localhost:3000/users/login', data);
            
            if(response.data && response.data.token){
                localStorage.setItem("user", JSON.stringify(response.data));
                history.push('/users');
            }
            
        }catch(error){
            const resMessage = (error.response && error.response.data && error.reponse.data.message ) || error.message || error.toString();
            setCaution(resMessage);
        }
    }

    const handleClick = () => {
        history.push('/register');
    }

    return (
        <Router>
            <FormContainer>
                <h3>Sign in</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" name="email" placeholder="이메일" ref={register({required: true})}/>
                    { errors.email && <span className="alert">이메일은 필수입력사항입니다.</span>}
                    <input type="password" name="password" placeholder="비밀번호" ref={register({required: true})}/>
                    { errors.password && <span className="alert">비밀번호는 필수입력사항입니다.</span>}
                    <input type="checkbox" name="auto" ref={register}/><label>자동 로그인</label>
                    <input type="submit" value="로그인"/>
                    {caution && (<div>{caution}</div>)}
                </form>
                <span><a href="#">비밀번호를 잊으셨나요?</a></span>
                <Button onClick={handleClick}>회원가입</Button>
                <div><p>Copyright ⓒ 2020 Enterphin All Rights Reserved</p></div>
            </FormContainer>
        </Router>
    )
}

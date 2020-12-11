import React, { useState } from 'react';
import axios from 'axios';
import Config from '../config';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FormContainer, Form, Button } from '../styles/Lib';

export default function Login() {
    const [ caution, setCaution ] = useState(''); 
    const { register, handleSubmit, errors } = useForm();
    
    let history = useHistory();
    
    const onSubmit = async data => {
        try{
            const response = await axios.post(`${Config.ORIGIN}/users/login`, data);
            
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
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" name="email" placeholder="이메일" ref={register({required: true})}/>
                    { errors.email && <span className="alert">이메일은 필수입력사항입니다.</span>}
                    <input type="password" name="password" placeholder="비밀번호" ref={register({required: true})}/>
                    { errors.password && <span className="alert">비밀번호는 필수입력사항입니다.</span>}
                    <input type="checkbox" name="auto" ref={register}/><label>자동 로그인</label>
                    <input type="submit" value="로그인"/>
                    {caution && (<div>{caution}</div>)}
                </Form>
                <span><button className="renew-password">비밀번호를 잊으셨나요?</button></span>
                <Button onClick={handleClick}>회원가입</Button>
                <div><p>Copyright ⓒ 2020 JAZOO All Rights Reserved</p></div>
            </FormContainer>
        </Router>
    )
}
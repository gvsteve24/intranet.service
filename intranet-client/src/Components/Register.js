import React from 'react';
import axios from 'axios';
import validator from 'validator';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import img from '../image/chevron-down@2x.png';

const FormContainer = styled.div`
    font-family: 'NanumSquare', sans-serif;
    font-size: 18px;  
    color: #fff;
    display: flex;
    flex-flow: column;
    background-color: #443E52;
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

    form div {
        display: flex;
        justify-content: space-between;
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

    select {
        display: block;
        width: 300px;
        height: 40px;
        border: 1px solid #f3f3f3;
        border-radius: 5px;
        background-color: #443E52;
        padding: 8px 11px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #808080;
        -webkit-appearance: none;
        background-image: url(${img});
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: 1.5em auto, 100%;
    }

    select:focus {
        color: #fff;
    }

    select:active {
        color: #fff;
    }
    select option:checked {
        color: #fff;
    }

    div {
        display: flex;
        justify-content: center;
    }

    p {
        font-size: 5px;
        color: #f3f3f3;
        margin-top: 90px;
        padding: 0 auto;
        box-sizing: border-box;
    }
`;

const StyledInput = styled.input`
    color: #fff;
    box-sizing: border-box;
    width: 300px;
    height: 40px;
    border: 1px solid #f3f3f3;
    border-radius: 5px;
    background-color: #443E52;
    padding: 12px;
    margin-bottom: 10px;

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
`;

const Submit = styled.input.attrs({type: 'submit'})`
    font-size: 18px;
    color: #443E52;
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
`;

export default function Register() {
    const history = useHistory();

    const { register, handleSubmit, errors, watch } = useForm();

    const onSubmit = async (data) => {
        data.phone = `${data.phone0}-${data.phone1}-${data.phone2}`;
        data.favorites = {};

        const response = await axios.post('http://localhost:3000/users/register', data);

        if( response && response.data){
            if(localStorage.getItem("user")){
                localStorage.removeItem("user");
            }

            localStorage.setItem("user", JSON.stringify(response.data));
            
            history.push('/users');
        }else if(response && response.errors){ 
            console.log(response.errors);
        }
    }

    return (
        <FormContainer>
            <h3>Sign up</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <StyledInput type="text" name="email" placeholder="이메일" ref={register({required: true, validate: value => validator.isEmail(value)})}/>
                { errors.email?.type==="required" && <span className="alert">이메일은 필수입력사항입니다.</span>}
                { errors.email?.type==="validate" && <span className="alert">이메일 양식에 맞지 않습니다.</span>}
                <StyledInput type="password" name="password" placeholder="비밀번호" ref={register({required: true})}/>
                { errors.password && <span className="alert">비밀번호는 필수입력사항입니다.</span>}
                <StyledInput type="password" name="passwordConfirm" placeholder="비밀번호 확인" ref={register({validate: value => value === watch("password")})}/>
                {errors.passwordConfirm && <span className="alert">비밀번호가 일치하지 않습니다.</span>}
                <div>
                    <StyledInput half type="text" name="kr_name" placeholder="한글 이름" ref={register({required: true})}/>
                    <StyledInput half type="text" name="en_name" placeholder="영문 이름" ref={register({required: true})}/>
                </div>
                { errors.kr_name && <span className="alert">한글이름은 필수입력사항입니다.</span> }
                { errors.en_name && <span className="alert">영문이름은 필수입력사항입니다.</span> }
                <select name="department" ref={register({required: true})}>
                    <option defaultValue="" value="">부서</option>
                    <option value="사업부">사업부</option>
                    <option value="연구소">연구소</option>
                </select>
                { errors.department && <span className="alert">부서는 필수선택사항입니다.</span> }
                <StyledInput type="text" name="address" placeholder="주소" ref={register}/>
                <div>
                    <StyledInput third type="text" name="phone0" placeholder="전화번호" ref={register({required: true})}/>
                    <StyledInput third type="text" name="phone1" ref={register({required: true})}/>
                    <StyledInput third type="text" name="phone2" ref={register({required: true})}/>
                </div>
                { errors.phone0 && <span className="alert">전화번호는 필수입력사항입니다.</span>}
                { errors.phone1 && <span className="alert">전화번호는 필수입력사항입니다.</span>}
                { errors.phone2 && <span className="alert">전화번호는 필수입력사항입니다.</span>}
                <Submit type="submit" value="회원가입"/>
            </form>
            <div><p>Copyright ⓒ 2020 Enterphin All Rights Reserved</p></div>
        </FormContainer>
    )
}

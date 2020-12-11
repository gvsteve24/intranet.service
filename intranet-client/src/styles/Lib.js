import styled, { css } from 'styled-components';
import logoImg from '../image/rsz_jazoo_logo.png';

export const Logo = styled.div`
    width: 30.5rem;
	height: 12.5rem;
	background-image: url(${logoImg});
	background-size: cover;
	background-position: center;

	@media (max-width: 768px) {
		display: none;
	}
`;

export const FormContainer = styled.div`
    font-family: 'NanumSquare', sans-serif;
    font-size: 1.125rem;  
    color: #fff;
    display: flex;
    flex-flow: column;
    background-color: #666;
    box-sizing: border-box;
    width: 30.5rem;
    min-width: 30.5rem;
    height: 44.375rem;
    padding: 75px 4rem 30px 4rem;

    @media (max-width: 768px) {
        max-width: 30.5rem;
        height: 100vh;
    }

    h3 {
        width: 100%;
        text-align: left;
        font-size: 36px;
        margin: 0;
    }

    input {
        color: #fff;
        font-size: .875rem;
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        border: 1px solid #f3f3f3;
        border-radius: 5px;
        background-color: #666;
        padding: 12px;
        margin-bottom: 10px;
        cursor: pointer;
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
        box-sizing: border-box;
        color: #666;
        font-size: 1.125rem;
        font-weight: 600;
        letter-spacing: -0.1em;
        line-height: 18px;
        width: 100%;
        height: 50px;
        padding: 15px 112px;
        border: 2px solid #fff;
        border-radius: 5px;
        margin-top: 1.25rem;
        background-color: #fff;
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

    .renew-password {
        border-style: none;
        background-color: #666;
        color: #fff;
        font-size: 14px;
        text-decoration-line: underline;
        text-decoration-color: #fff;
        cursor: pointer;
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

export const Form = styled.form`
    width: 100%;
    margin-top: 1.25rem; 
`;

export const Button = styled.button`
    font-family: 'NanumSquare', sans-serif;
    color: #fff;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 15px 117px;
    background-color: #666;
    border: 2px solid #fff;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: -0.06em;
    cursor: pointer;

    ${props => 
        props.primary && 
        css`
            background-color: #fff;
            color: #443E52;
        `};
`;

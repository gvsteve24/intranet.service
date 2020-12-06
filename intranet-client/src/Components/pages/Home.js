import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import Login from '../Login';
import logoImg from '../../image/rsz_jazoo_logo.png';

const Logo = styled.div `
    width: 426px;
    height: 120px;
    background-image: url(${logoImg});
    background-size: cover;
    background-position: center;

    @media (max-width: 768px) {
        display: none;
    }
`;

export default function Home() {
    const history = useHistory();

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        if (user && user.token) {
            history.push('/users');
        }
    }, []);

    return ( <
        div className = "App" >
        <
        Link to = "/" > < Logo / > < /Link> <
        Login / >
        <
        /div>
    )
}
import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import Login from '../Login';
import logoImg from '../../image/enterphin.png'; 

const Logo = styled.div`
    width: 426px;
    height: 80px;
    background-image: url(${logoImg});
    background-size: cover;
    background-position: center;
`;

export default function Home() {
    const history = useHistory();

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        if(user && user.token){
            console.log("auth pass");
            history.push('/users');
        }
    }, []);

    return (
        <div className="App">
            <Link to="/"><Logo/></Link>
            <Login/>
        </div>
    )
}

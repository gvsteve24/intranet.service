import React from 'react';
import Register from '../Register';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import logoImg from '../../image/rsz_jazoo_logo.png'; 

const Logo = styled.div`
    width: 426px;
    height: 120px;
    background-image: url(${logoImg});
    background-size: cover;
    background-position: center;
`;

export default function Signup() {
    return (
        <div className="App">
            <Link to="/"><Logo/></Link>
            <Register/>
        </div>
    )
}

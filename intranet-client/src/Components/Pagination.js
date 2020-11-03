import React from 'react'
import styled from 'styled-components/macro';
const PageNav = styled.nav`
    ul {
        list-style: none;
        width: 250px;
        padding: 0;
        margin: 20px auto;
    }

    li {
        display: inline-block;
        width: 30px;
        margin: 10px;
    }

    span {
        cursor: pointer;
    }
`;

const Pagination = ({ messagesPerPage, totalMessages, paginate }) => {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalMessages/messagesPerPage); i++){
        pageNumbers.push(i);
    }
    
    return (
        <PageNav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <span onClick={() => paginate(number)} className="page-link">{number}</span>
                    </li>
                ))}
            </ul>
        </PageNav>
    )
}

export default Pagination;
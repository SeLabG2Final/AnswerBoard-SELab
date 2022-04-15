import styled from 'styled-components';
import { media } from '../../common/helpers/mediaQuery';

const DefaultStyledButton = styled.button`
    box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
    -webkit-box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
    -moz-box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
    font-family: inherit;
    font-size: var(--small-font-size);
    font-weight: var(--fw-bold);
    max-width: 100%;
    height: 100%;
    cursor: pointer;
    outline: none;
    border: none;
    /* border: 5px solid red; */
    border-radius: calc(2 * var(--div-border-radius));
    padding: calc(var(--post-card-padding) / 2);
    background-color: var(--secondary-color);
    color: var(--white-color);
    
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background-color: var(--dark-secondary-color);
    }

    &.logout-btn {
        width: 100%;
    }
`

export {
    DefaultStyledButton
};
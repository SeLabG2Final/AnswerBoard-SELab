import styled from 'styled-components';
import { media } from '../../common/helpers/mediaQuery';

const SearchBarContainer = styled.div`
    /* border: 5px solid var(--primary-color); */
    height: calc(2 * var(--navbar-height));
    background-color: var(--primary-color);
    padding: var(--post-card-margin);
    display: flex;
    
    gap: var(--post-card-margin);
    
    ${media.mobile} {
        margin-top: calc((var(--post-card-margin) * 2) + var(--navbar-height) / 2);
        flex-direction: column;
    }
    
    ${media.desktop} {
        height: var(--navbar-height);
        padding: var(--post-card-margin);
        & > *:nth-child(1) {
            flex: 0.7;
        }
    
        /* child 2 is new-post-btn div*/
        & > *:nth-child(2) {
            flex: 0.3;
        }
    }

`

const SearchBoxContainer = styled.div`
    border: 5px solid yellow;
`

const SearchBox = styled.div`
    /* border: 5px solid red; */
    overflow: hidden;
    position: relative;

    ${media.mobile} {
        height: calc(var(--navbar-height) / 1.8);
    }
`

const SearchInput = styled.input`
    width: 100%;
    height: 100%;
    font-family: inherit;
    border: 0.1rem solid var(--input-color);
    border-radius: calc(2 * var(--div-border-radius));
    outline: none;
    padding-left: calc(2 * var(--post-card-padding));
    background-color: var(--white-color);
    
    &:hover,
    &:focus {
        outline: none;
        border: 0.1rem solid var(--secondary-color);
    }
    
    ${media.desktop} {
        padding-left: calc(1.6 * var(--post-card-padding));
    }
`

const SearchIcon = styled.svg`
    position: absolute;
    display: inline-block;
    width: 1em;
    top: 23%;
    left: var(--post-card-margin);
    color: var(--black-color);
    cursor: text;
`

const AddPostButton = styled.button`
    box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
    -webkit-box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
    -moz-box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
    font-family: inherit;
    font-size: var(--small-font-size);
    font-weight: var(--fw-bold);
    width: 100%;
    /* height: var(--navbar-height); */
    cursor: pointer;
    outline: none;
    border: none;
    /* border: 5px solid red; */
    border-radius: calc(var(--div-border-radius) * 2);
    padding: calc(var(--post-card-padding) / 2);
    background-color: var(--secondary-color);
    color: var(--white-color);

    
    max-width: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:disabled {
        background-color: var(--gray-color);
        color: var(--black-color);
    }

    &:not(:disabled)&:hover {
        background-color: var(--dark-secondary-color);
        color: var(--white-color);
    }
`

export {
    SearchBarContainer,
    SearchBoxContainer,
    SearchBox,
    SearchInput,
    AddPostButton,
    SearchIcon
};
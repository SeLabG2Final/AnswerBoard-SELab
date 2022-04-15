import styled from 'styled-components';

const InputField = styled.input`
    width: 100%;
    height: calc(var(--navbar-height) * 0.6);
    padding-block: var(--post-card-margin);
    padding-inline: var(--post-card-margin);
    /* margin-block: var(--post-card-margin); */
    margin-bottom: var(--post-card-margin);
    border: 2px solid var(--gray-color);
    border-radius: var(--div-border-radius);
    background-color: var(--white-color);
    font-size: var(--normal-font-size);
    resize: none;
    
    &:disabled {
        background-color: var(--primary-color);
    }

    &:focus {
        outline: none !important;
        border-color: var(--secondary-color);
        /* box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
        -webkit-box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67);
        -moz-box-shadow: 1px 2px 9px -2px rgba(50,128,255,0.67); */
    }
`

export {
    InputField
};
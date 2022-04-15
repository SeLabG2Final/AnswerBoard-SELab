import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledFormWrapper = styled.div`
    background: var(--primary-color);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    & .error-field {
        margin: 0.5em;
        color: var(--error-color);
    }
`

const StyledForm = styled.form`
    background-color: var(--white-color); 
    border-radius: 1.2rem;
    width: min(90%, 400px);
    padding: 3em;
    box-shadow: -1px 2px 38px 8px rgba(228, 229, 234, 1);
    -webkit-box-shadow: -1px 2px 38px 8px rgba(228, 229, 234, 1);
    -moz-box-shadow: -1px 2px 38px 8px rgba(228, 229, 234, 1);

    & .form__signup-para, & .form__login-para {
        margin-bottom: 0.1em;
    }
`

const StyledFormDiv = styled.div`
    position: relative;
    height: var(--input-field-size);
    margin-top: 2.5em;
`


const StyledLabel = styled.label`
    position: absolute;
    left: 1em;
    top: calc(0.3 * var(--input-field-size));
    padding: 0 0.25em;
    background: none;
    color: var(--input-color);
    font-size: var(--normal-font-size);
    z-index: 10;
    cursor: text;
    transition: 0.2s;
`

const StyledInput = styled.input`
    position: absolute;
    border: 2px solid var(--input-color);
    border-radius: var(--div-border-radius);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: var(--normal-font-size);
    padding: 0.75em;
    outline: none;
    z-index: 1;
    color: var(--black-color);

    &:focus, &:hover {
        border: 2px solid var(--secondary-color);
    }

    &:hover + .form__label {
        color: var(--secondary-color);
    }

    &:focus + .form__label {
        top: calc(-0.2 * var(--input-field-size));
        left: calc(0.5 * var(--input-field-size));
        color: var(--secondary-color);
        font-size: var(--small-font-size);
        font-weight: var(--fw-highlight);
        z-index: 10;
        background-color: var(--white-color);
    }

    &:not(:placeholder-shown)&:not(:focus) + .form__label {
        top: calc(-0.2 * var(--input-field-size));
        left: calc(0.5 * var(--input-field-size));
        font-size: var(--small-font-size);
        font-weight: var(--fw-highlight);
        z-index: 10;
        background-color: var(--white-color);
    }
`

const StyledButton = styled.button`
    display: block;
    width: 100%;
    height: var(--input-field-size);
    padding: 0.5em auto;
    margin-block: 2.5em;
    outline: none;
    border: none;
    background-color: var(--secondary-color);
    color: var(--white-color);
    font-family: inherit;
    font-size: var(--normal-font-size);
    font-weight: var(--fw-bold);
    border-radius: var(--div-border-radius);
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        background-color: ${(props) => (props.type === 'submit') ? `var(--black-color)` : `var(--dark-secondary-color)`};
    }
`

const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: var(--fw-bold);
    color: var(--secondary-color);

    &:hover {
        border-bottom: 1px solid var(--secondary-color);
    }

    &:visited {
        decoration: none;
    }
`

export { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink };
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    ${'' /* @import url('https://fonts.googleapis.com/css2?family=Acme&family=Bebas+Neue&display=swap'); */}

    :root {
        ${'' /* CSS VARIABLES */}

        --font-base: sans-serif;

        --normal-font-size: 1rem;
        --small-font-size: 0.75rem;
        --extra-small-font-size: 0.5rem;
        --fw-extra-bold: 900;
        --fw-bold: 700;
        --fw-highlight: 500;

        --field-margin: 2.5em;
        --input-field-size: 2.5em;

        --navbar-height: 55px;

        --post-card-size: 10vh;
        --post-card-margin: 0.75em;
        --post-card-padding: 1.5em;

        --div-margin: 0.75em;
        --div-padding: 0.75em;
        --div-border-radius: 10px;
        
        --primary-color: #F4F4F9;
        --secondary-color: #1A73E8;
        --dark-secondary-color: #1243EB;
        --error-color: #DE2C00;
        --input-color: #80868B;
        --black-color: #0D1821;
        --gray-color: #E4E5EA;
        --light-gray-color: #EBECF2;
        --dark-gray-color: #D3D3D3;
        --white-color: #FFFFFF;

        ${'' /* ROOT CSS SETTINGS */}
        
        font-family: var(--font-base);
        height: 100vh;
        overflow: hidden;
    }

    ${'' /* scroll-bar colors */}
    ::-webkit-scrollbar {
        width: var(--div-margin);
    }

    ::-webkit-scrollbar-track {
        background-color: var(--primary-color);
        border-radius: calc(var(--div-margin) / 2);
    }

    ::-webkit-scrollbar-thumb {
        background-color: var(--black-color);
        ${'' /* background: rgba(0, 0, 0, 0.5); */}
        border: calc(var(--div-margin) / 5) solid var(--primary-color);
        border-radius: calc(var(--div-margin) / 2);

        ${'' /* &:hover {
            background-color: var(--gray-color);
        } */}
    }

    *,::before,::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        caret-color: rgba(0,0,0,0);
    }

    body {
        background-color: var(--primary-color);
    }

    body,
    #root,
    .App {
        height: 100%;
    }

    input:focus, textarea:focus {
        caret-color: rgba(0,0,0,1);
    }
`

export default GlobalStyles;
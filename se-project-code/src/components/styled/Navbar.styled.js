import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media, mediaScreenSize } from '../../common/helpers/mediaQuery';
import { DefaultStyledButton } from './DefaultStyledButton';


const NavbarContainer = styled.div`
    height: var(--navbar-height);
    position: relative;
    top: 0;
    background-color: var(--primary-color);

    ${media.mobileSmall} {
        &.make-z-index-big {
            z-index: 99999;
        }
    }
    
    ${media.desktop} {
        display: flex;
        align-items: center;
        gap: var(--post-card-margin);
    }
`

const LogoSection = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    /* border: 5px solid red; */
    gap: var(--post-card-margin);
    /* padding-right: var(--post-card-margin); */

    ${media.mobile} {
        justify-content: center;
    }
    
    ${media.desktop} {
        flex: 0.4;
        justify-content: space-between;
    }
`

const ButtonGroup = styled.div`
    /* box-sizing: border-box; */
    display: flex;
    /* border: 5px solid black; */
    gap: var(--post-card-margin);

    ${media.desktop} {
        margin-inline: var(--post-card-margin);
    }
    
    ${media.mobile} {
        margin-top: calc((var(--post-card-margin) * 2) + var(--navbar-height) / 2);
        flex: 0.15;
        height: calc(var(--navbar-height) * 2);
        flex-direction: column;
        justify-content: center;
        padding: var(--post-card-margin);
    }
`

const MoreSection = styled.div`
    /* border: 5px solid var(--secondary-color); */
    position: relative;
    height: 100%;
    
    ${media.mobile} {
        display: none;
        height: 100%;
        
        &.more-menu-is-open {
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 99999;
            background-color: var(--primary-color);
            width: min(${mediaScreenSize.mobileSmallMax}, 75vw);
            border-left: 0.5em solid var(--gray-color);
            border-radius: var(--div-border-radius);
            
            & * {
                z-index: 99999;
            }
            
            ${media.mobileSmall} {
                width: 100vw;
                border-left: none;
            }

            & .logout-div {
                height: var(--navbar-height);
                padding: var(--post-card-margin);
                display: flex;
                justify-content: center;

            }
        }
    }

    ${media.desktop} {
        /* margin-inline: var(--post-card-margin); */
        display: flex;
        flex: 1;
        justify-content: space-between;

        & .logout-div {
            width: 6em;
            padding: var(--post-card-margin);
        }
    }

`

const NavList = styled.ul`
    /* border: 5px solid lightgreen; */
    list-style: none;
    display: flex;
    align-items: center;

    ${media.mobile} {
        margin-block: var(--post-card-margin);
        flex-direction: column;
        justify-content: center;
        gap: var(--post-card-margin);
    }

    ${media.desktop} {
        flex: 0.85;
        /* border: 5px solid lightgreen; */
    }
`


const NavClassContainer = styled.div`
    display: flex;
    ${media.mobile} {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`

const NavItem = styled.li`
    font-weight: var(--fw-bold);
    cursor: pointer;
    position: relative;

    ${media.desktop} {
        margin-inline: var(--post-card-margin);
    }
`

const ClassNavDropdownContainer = styled.div`
    height: 200px;
    width: 200px;
    display: flex;
    flex-direction: column;
    background-color: var(--white-color);
    border-radius: var(--div-border-radius);
    /* border-top-left-radius: 0; */

    ${media.mobile} {
        margin-top: var(--post-card-margin);
    }
    
    ${media.desktop} {
        box-shadow: -1px 1px 7px 2px rgba(0,0,0,0.2);
        -webkit-box-shadow: -1px 1px 7px 2px rgba(0,0,0,0.2);
        -moz-box-shadow: -1px 1px 7px 2px rgba(0,0,0,0.2);
        
        position: absolute;
        top: var(--navbar-height);
        width: 200px;
        height: 200px;
        z-index: 1;
    }
`

const DropdownItem = styled.div`
    margin-top: var(--post-card-margin);
    margin-left: var(--post-card-margin);

    & .dropdown-item {
        text-decoration: none;
    }

    & .dropdown-item.active-class {
        border-bottom: 1px solid var(--secondary-color);
    }

    & .dropdown-item:hover {
        border-bottom: 1px solid var(--secondary-color);
    }

    & .dropdown-item:visited {
        decoration: none;
        color: var(--black-color);
        /* color: none; */
    }
`

const NavigationLink = styled(Link)`
    text-decoration: none;
    color: var(--black-color);

    &:hover {
        border-bottom: 1px solid var(--secondary-color);
    }

    &:visited {
        decoration: none;
    }

    &.logo-link {
        /* border: 5px solid blue; */
        /* margin-left: 3em; */
        display: flex;
        justify-content: center;
        align-items: center;

        ${media.desktop} {
            margin-left: var(--post-card-margin);
        }
    }

    &.logo-link:hover {
        border: none;
    }

    & .logo-img {
        width: 9em;
        height: 100%;
    }
`

const LogoutBtn = styled(DefaultStyledButton)`
    margin: var(--post-card-margin);
    border-radius: calc(2 * var(--div-border-radius));

    /* height: calc(var(--navbar-height) / 2); */
    /* border: 5px solid red; */
`

const MoreVertIcon = styled.svg`
    ${media.desktop} {   
        display: none;
    }

    position: fixed;
    top: calc((var(--navbar-height) - calc(var(--post-card-margin) * 2.3)) / 2.3);
    right: var(--post-card-margin);
    width: calc(var(--post-card-margin) * 2.3);
    z-index: 9999;
    cursor: pointer;

    &:hover {
        color: var(--dark-secondary-color);
    }
`

const CloseIcon = styled(MoreVertIcon)`
    z-index: 999999;
`

export {
    NavbarContainer,
    LogoSection,
    MoreSection,
    ButtonGroup,
    NavList,
    NavClassContainer,
    NavItem,
    ClassNavDropdownContainer,
    DropdownItem,
    NavigationLink,
    LogoutBtn,
    MoreVertIcon,
    CloseIcon
};
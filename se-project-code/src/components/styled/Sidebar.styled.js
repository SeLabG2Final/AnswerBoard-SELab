import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { media, mediaScreenSize } from '../../common/helpers/mediaQuery';


const SidebarContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
    /* border: 5px solid var(--secondary-color); */
    
    ${media.mobile} {
        position: fixed;
        inset: 0 30% 0 0;
        z-index: 9999;
        background-color: var(--primary-color);
        width: min(75vw, ${mediaScreenSize.mobileSmallMax});
        border-right: 0.5em solid var(--gray-color);
        border-radius: var(--div-border-radius);
        

        ${media.mobileSmall} {
            width: 100vw;
            border-right: none;
        }

        &.sidebar-is-closed {
            display: none;
        }
    }

    ${media.desktop} {
        flex: 0.4;
    }
`

const OpenMenuIcon = styled.svg`
    ${media.desktop} {   
        display: none;
    }

    position: fixed;
    top: calc((var(--navbar-height) - calc(var(--post-card-margin) * 2.3)) / 2.3);
    left: var(--post-card-margin);
    width: calc(var(--post-card-margin) * 2.3);
    cursor: pointer;
    z-index: 9999;
    
    &:hover {
        color: var(--dark-secondary-color);
    }
`

const CloseMenuIcon = styled(OpenMenuIcon)`
    z-index: 99999;
`

export { SidebarContainer, OpenMenuIcon, CloseMenuIcon };
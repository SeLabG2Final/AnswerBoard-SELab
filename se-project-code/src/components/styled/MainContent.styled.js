import styled from 'styled-components';
import { media } from '../../common/helpers/mediaQuery';

const MainContentWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-block: var(--post-card-margin);
    border-radius: var(--div-border-radius);
    background-color: var(--white-color);
`

const MainContentOverflowDiv = styled.div`
    overflow-y: auto;
    height: 100%;
    background-color: var(--primary-color);
    border-radius: var(--div-border-radius);
    margin: var(--post-card-margin);
    /* margin-right: 0; */
    padding: var(--post-card-margin);

    ${media.desktop} {
        /* margin-right: var(--post-card-margin); */
    }
`

export {
    MainContentWrapper,
    MainContentOverflowDiv
};
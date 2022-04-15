import styled from "styled-components";
import { media } from '../../common/helpers/mediaQuery';

const DashboardMainWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    /* border: 5px solid white; */
    overflow-y: auto;
    background-color: var(--primary-color);


    ${media.desktop} {
        width: 90%;
        margin: 0 auto;
    }
`

const PostAndContentWrapper = styled.div`
    height: 100%;
    display: flex;
    overflow-y: auto;
    /* border: 5px solid black; */

    ${media.mobile} {
        flex-direction: column;
    }

    ${media.desktop} {
        gap: var(--post-card-margin);
    }
`

export { DashboardMainWrapper, PostAndContentWrapper };
import styled from 'styled-components';
import { media } from '../../common/helpers/mediaQuery';

const ContentAreaWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    /* overflow-y: auto; */
    background-color: var(--primary-color);
    /* border-bottom: var(--post-card-margin) solid var(--primary-color); */

    ${media.desktop} {
        flex: 1;
    }
`

export { ContentAreaWrapper };
import styled from 'styled-components';

const PostListContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-block: var(--post-card-margin);
    /* border: 5px solid lightgreen; */
    background-color: var(--primary-color);

    & > * {
        flex: 0 0 var(--post-card-size);
        cursor: pointer;
    }

    &::-webkit-scrollbar-track {
        background-color: var(--primary-color);        
    }
`

const StyledPostCard = styled.div`
    background-color: var(--gray-color);
    margin: var(--post-card-margin);
    padding-block: calc(var(--post-card-padding) / 2);
    padding-inline: var(--post-card-padding);
    border-radius: var(--div-border-radius);
    ${(props) => (props.color) ? "background-color: var(--white-color);" : ""}
    position: relative;
    z-index: 0;
    
    & .inner-post-card {
        overflow: hidden;
        height: calc(var(--post-card-size) - 1.7em);
        max-width: 100%;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    &:hover {
        background-color: var(--white-color);
    }

    &.active-post {
        background-color: var(--white-color);
    }

    &.active-post::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(var(--post-card-margin) / 2);
        height: var(--post-card-size);
        border-top-left-radius: var(--div-border-radius);
        border-bottom-left-radius: var(--div-border-radius);
        background-color: var(--secondary-color);
        z-index: 99999;
    }

    & .icon-div {
        position: absolute;
        top: calc(var(--post-card-padding) / 2);
        /* right: 0; */
        right: calc(var(--post-card-padding) / 2);
        bottom: calc(var(--post-card-padding) / 2);
        display: flex;
        flex-direction: column;
        gap: calc(var(--post-card-padding) / 2);
    }

    & .exclamation-icon {
        /* position: absolute;
        right: calc(var(--post-card-padding) / 2); */
        min-width: 1em;
        min-height: 1em;
        fill: red;
    }
`

export { PostListContainer, StyledPostCard };
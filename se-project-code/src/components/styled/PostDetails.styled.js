import styled from 'styled-components';

const PostDetailsContainer = styled.div`
    background-color: var(--primary-color);
`

const PostBox = styled.div`
    border: 2px solid var(--gray-color);
    min-height: calc(var(--post-card-size) * 3);
    border-radius: var(--div-border-radius);
    margin-bottom: var(--post-card-margin);
    padding-top: calc(var(--post-card-margin) / 2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & .post__content {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-x: auto;
        margin-inline: calc(var(--post-card-margin) / 2);
    }

    & .post__summary {
        font-weight: var(--fw-bold);
        margin-bottom: var(--post-card-margin);
    }
    
    
    & .post-btn-container {
        margin-bottom: calc(var(--post-card-margin) / 2);
        display: flex;
        justify-content: space-between;
    }
`

const EditDeleteBtnGroup = styled.div`

`

export {
    PostDetailsContainer,
    PostBox,
    EditDeleteBtnGroup
};
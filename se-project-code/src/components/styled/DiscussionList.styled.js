import styled from 'styled-components';

const DiscussionListContainer = styled.div`
    background-color: var(--primary-color);
    width: 100%;
    height: var(--navbar-height);
    display: flex;
    align-items: center;
    gap: var(--post-card-margin);
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
        display: none;
    }
`

const DiscussionListOverflowDiv = styled.div`
    margin-inline: var(--post-card-margin);
    background-color: var(--primary-color);
    width: 100%;
    height: var(--navbar-height);
    display: flex;
    align-items: center;
    gap: var(--post-card-margin);
    padding: var(--post-card-margin);
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
        display: none;
    }
`

const DiscussionListItem = styled.div`
    border-radius: var(--div-border-radius);
    background-color: var(--gray-color);
    padding: calc(var(--div-padding) / 2);
    cursor: pointer;
    
    &:hover {
        background-color: var(--dark-gray-color);
    }

    &.active-discussion {
        background-color: var(--light-gray-color);

        box-shadow: -1px 1px 7px 2px rgba(0,0,0,0.2);
        -webkit-box-shadow: -1px 1px 7px 2px rgba(0,0,0,0.2);
        -moz-box-shadow: -1px 1px 7px 2px rgba(0,0,0,0.2);
    }
`

export {
    DiscussionListContainer,
    DiscussionListOverflowDiv,
    DiscussionListItem
};
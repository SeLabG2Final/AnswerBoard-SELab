import styled from 'styled-components';

const DashboardFormButton = styled.button`
    font-family: inherit;
    font-size: var(--small-font-size);
    font-weight: var(--fw-bold);
    cursor: pointer;
    outline: none;
    border: none;
    /* border: 5px solid red; */
    border-radius: calc(2 * var(--div-border-radius));
    padding: calc(var(--post-card-padding) / 2);
    background-color: var(--secondary-color);
    color: var(--white-color);

    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:disabled {
        background-color: var(--gray-color);
        color: var(--black-color);
    }

    &:not(:disabled)&:hover {
        background-color: var(--dark-secondary-color);
        color: var(--white-color);
    }


    &.mg-left-btn {
        margin-left: var(--post-card-margin);
    }

    &.mg-top-btn {
        margin-top: var(--post-card-margin);
    }
`

export {
    DashboardFormButton
};
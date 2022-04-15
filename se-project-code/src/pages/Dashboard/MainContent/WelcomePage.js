import React from 'react';
import styled from 'styled-components';

function WelcomePage() {
    return (
        <WelcomePageWrapper>Welcome to AnswerBoard!</WelcomePageWrapper>
    );
}

const WelcomePageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default WelcomePage;
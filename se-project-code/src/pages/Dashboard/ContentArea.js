import React from 'react';
import DiscussionList from '../../components/DiscussionList';
import MainContent from './MainContent/MainContent';
import { ContentAreaWrapper } from '../../components/styled/ContentArea.styled';

function ContentArea() {
    return (
        <ContentAreaWrapper>
            <DiscussionList />
            <MainContent />
        </ContentAreaWrapper>
    );
}

export default ContentArea;
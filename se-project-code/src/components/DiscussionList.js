import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { selectCurrentClass, selectJoinedClasses } from '../features/classes/classSlice';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { updateCurrentDiscussion } from '../features/posts/postSlice';
import { DiscussionListContainer, DiscussionListItem, DiscussionListOverflowDiv } from './styled/DiscussionList.styled';

function DiscussionList() {
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);
    const dispatch = useDispatch();
    const [activeDiscussion, setActiveDiscussion] = useState('');

    const handleClick = (discussion) => {
        dispatch(updateCurrentDiscussion(discussion));
        setActiveDiscussion(discussion);
        dispatch(resetDropdown());
        dispatch(toggleContent('other'));
    }

    return (
        <DiscussionListContainer>
            <DiscussionListOverflowDiv>
                <DiscussionListItem
                    className={activeDiscussion === '' ? 'active-discussion' : ''}
                    onClick={() => { handleClick('') }}
                >
                    All
                </DiscussionListItem>
                {
                    (joinedClasses.length !== 0 && currentClass?.discussions.length !== 0)
                        ?
                        currentClass?.discussions.map(discussion => (
                            <DiscussionListItem
                                key={discussion}
                                className={activeDiscussion === discussion ? 'active-discussion' : ''}
                                onClick={() => { handleClick(discussion) }}
                            >
                                {discussion}
                            </DiscussionListItem>
                        ))
                        :
                        (
                            <></>
                        )
                }
            </DiscussionListOverflowDiv>
        </DiscussionListContainer>
    );
}

export default DiscussionList;
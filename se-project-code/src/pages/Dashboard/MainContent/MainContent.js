import React, { useEffect } from 'react';
import PostDetails from '../../../components/PostDetails';
import NewPostForm from './NewPostForm';
import CreateClass from './CreateClass';
import JoinClass from './JoinClass';
import { MainContentOverflowDiv, MainContentWrapper } from '../../../components/styled/MainContent.styled';
import { useSelector } from 'react-redux';
import { selectMainContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { selectUser } from '../../../features/user/userSlice';
import ResourcesTab from './ResourcesTab';
import StatisticsTab from './StatisticsTab';
import ManageClassTab from './ManageClassTab';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import { selectCurrentClass } from '../../../features/classes/classSlice';

function MainContent() {
    const user = useSelector(selectUser);
    const mainContent = useSelector(selectMainContent);
    const currentClass = useSelector(selectCurrentClass);
    const canManageClass = currentClass?.instructors_list?.includes(user.email);

    return (
        <MainContentWrapper>
            <MainContentOverflowDiv>

                {mainContent === 'new-post' && <NewPostForm />}
                {user.role === 'instructor' && mainContent === 'create-class' && <CreateClass />}
                {mainContent === 'join-class' && <JoinClass />}

                {
                    mainContent === 'other'
                    &&
                    <>
                        <Routes>
                            <Route path=":p_id" element={<PostDetails />} />
                            <Route path={`resources`} element={<ResourcesTab />} />
                            <Route path={`statistics`} element={<StatisticsTab />} />
                            {
                                canManageClass
                                &&
                                <Route path={`manage-class`} element={<ManageClassTab />} />
                            }
                            <Route path="*" element={<WelcomePage />} />
                        </Routes>
                    </>
                }
            </MainContentOverflowDiv>
        </MainContentWrapper>
    );
}

export default MainContent;
import React, { useEffect } from 'react';
import ResourcesTab from '../pages/Dashboard/MainContent/ResourcesTab';
import StatisticsTab from '../pages/Dashboard/MainContent/StatisticsTab';
import ManageClassTab from '../pages/Dashboard/MainContent/ManageClassTab';
import { selectMainContent, toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../features/user/userSlice';

function NavTabs() {
    const user = useSelector(selectUser);
    const mainContent = useSelector(selectMainContent);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(mainContent);
    }, [mainContent]);

    return (
        <>
            <div>NavTabs</div>
            <button
                onClick={() => { dispatch(toggleContent('navTabs/resourcesTab')) }}
            >
                Resources
            </button>
            <button
                onClick={() => { dispatch(toggleContent('navTabs/statisticsTab')) }}
            >
                Statistics
            </button>
            {
                user.role === 'instructor'
                &&
                <button
                    onClick={() => { dispatch(toggleContent('navTabs/manageClassTab')) }}
                >
                    Manage Class
                </button>
            }
            {mainContent === 'navTabs/resourcesTab' && <ResourcesTab />}
            {mainContent === 'navTabs/statisticsTab' && <StatisticsTab />}
            {user.role === 'instructor' && mainContent === 'navTabs/manageClassTab' && <ManageClassTab />}
        </>
    );
}

export default NavTabs;
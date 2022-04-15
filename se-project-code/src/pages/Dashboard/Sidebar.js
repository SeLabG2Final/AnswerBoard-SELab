import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardSearch from '../../components/DashboardSearch';
import PostsList from '../../components/PostsList';
import { SidebarContainer, OpenMenuIcon, CloseMenuIcon } from '../../components/styled/Sidebar.styled';
import { hideMoreMenu, selectMoreMenuStatus, selectSidebarStatus, toggleSidebar } from '../../features/sidebar/sidebarSlice';

function Sidebar() {
    const showMore = useSelector(selectMoreMenuStatus);
    const showSidebar = useSelector(selectSidebarStatus);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            {(!showSidebar) ?
                <OpenMenuIcon
                    onClick={() => {
                        dispatch(toggleSidebar());
                        dispatch(hideMoreMenu());
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </OpenMenuIcon>
                :
                <CloseMenuIcon
                    onClick={() => {
                        dispatch(toggleSidebar());
                        dispatch(hideMoreMenu());
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </CloseMenuIcon>
            }
            <SidebarContainer className={(showSidebar) ? "" : "sidebar-is-closed"}>
                <DashboardSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <PostsList
                    searchTerm={searchTerm}
                />
            </SidebarContainer>
        </>
    );
}

export default Sidebar;
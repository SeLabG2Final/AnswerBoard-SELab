import React from 'react';
import {
    SearchBarContainer,
    SearchBox,
    SearchInput,
    AddPostButton,
    SearchIcon,
    SearchBoxContainer
} from './styled/DashboardSearch.styled';
import { useDispatch, useSelector } from 'react-redux';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { selectCurrentClass, selectJoinedClasses } from '../features/classes/classSlice';
import { hideSidebar } from '../features/sidebar/sidebarSlice';


function DashboardSearch({ searchTerm, setSearchTerm }) {
    const dispatch = useDispatch();
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);

    const handleClick = () => {
        dispatch(hideSidebar());
        dispatch(toggleContent('new-post'));
        dispatch(resetDropdown());
    }

    const noCurrentClassAvailable = (
        joinedClasses.length === 0
        ||
        currentClass == undefined
        ||
        currentClass === null
    )

    return (
        <SearchBarContainer>
            <SearchBox>
                <SearchIcon xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </SearchIcon>
                <SearchInput
                    type=""
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchBox>
            {/* <SearchBoxContainer>
            </SearchBoxContainer> */}
            <div className="add-post-btn">
                <AddPostButton disabled={noCurrentClassAvailable} onClick={handleClick}>New Post</AddPostButton>
            </div>
        </SearchBarContainer>
    );
}

export default DashboardSearch;
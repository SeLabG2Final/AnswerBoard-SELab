import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { selectCurrentClass, selectJoinedClasses, updateCurrentClass } from '../features/classes/classSlice';
import { hideMoreMenu } from '../features/sidebar/sidebarSlice';
import { ClassNavDropdownContainer, DropdownItem } from './styled/Navbar.styled';


function ClassNavDropdown({ className }) {
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);
    const dispatch = useDispatch();

    const handleClick = (cls) => {
        dispatch(hideMoreMenu());
        dispatch(resetDropdown());
        dispatch(updateCurrentClass(cls));
    };

    return (
        <ClassNavDropdownContainer>
            {
                joinedClasses.length !== 0
                    ? joinedClasses.map((cls) => (
                        <DropdownItem key={cls.c_id}>
                            <Link
                                className={currentClass === cls ? 'active-class dropdown-item' : 'dropdown-item'}
                                onClick={() => { handleClick(cls) }} to={`/dashboard/${cls.c_id}`}
                            >
                                {cls.c_num}
                            </Link>
                        </DropdownItem>
                    ))
                    : <Link onClick={handleClick} to="#">you have no classes yet.</Link>
            }
        </ClassNavDropdownContainer>
    )
}

export default ClassNavDropdown;
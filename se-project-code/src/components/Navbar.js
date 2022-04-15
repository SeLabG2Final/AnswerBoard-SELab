import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    NavbarContainer,
    LogoSection,
    ButtonGroup,
    NavList,
    NavItem,
    NavigationLink,
    MoreSection,
    MoreVertIcon,
    CloseIcon,
    NavClassContainer,
    LogoutBtn
} from '../components/styled/Navbar.styled';
import { logout, reset, selectUser, selectUserStatus } from '../features/user/userSlice';
import ClassNavDropdown from './ClassNavDropdown';
import { resetDropdown, selectShowDropdown, toggleDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { resetMainContent, toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { resetClasses, selectCurrentClass, selectJoinedClasses } from '../features/classes/classSlice';
import { resetPosts } from '../features/posts/postSlice';
import { hideMoreMenu, hideSidebar, selectMoreMenuStatus, showMoreMenu, toggleMore } from '../features/sidebar/sidebarSlice';
import { DefaultStyledButton } from './styled/DefaultStyledButton';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import CloseIcon from '@mui/icons-material/Close';


function Navbar() {
    const showMore = useSelector(selectMoreMenuStatus);
    const user = useSelector(selectUser);
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);
    const { isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showClassDropdown = useSelector(selectShowDropdown);
    const [storeResetDone, setStoreResetDone] = useState(false);
    const canManageClass = currentClass?.instructors_list?.includes(user.email);

    // check if screen is mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 720)

    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 920) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    // create an event listener
    useEffect(() => {
        window.addEventListener("resize", handleResize);
    });

    // finally you can render components conditionally if isMobile is True or False 

    useEffect(() => {
        if (isError) {
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        if (storeResetDone && (isSuccess || !user)) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, storeResetDone, navigate, dispatch]);

    const handleNavTabClick = () => {
        dispatch(toggleContent('other'));
        dispatch(resetDropdown());
        dispatch(hideMoreMenu());
    }

    const handleLogout = async () => {
        const isOkayToDelete = window.confirm('Are you sure you want to logout?');
        if (isOkayToDelete) {
            localStorage.removeItem('currentClass');
            dispatch(hideMoreMenu());
            dispatch(resetPosts());
            dispatch(resetDropdown());
            dispatch(resetMainContent());
            dispatch(resetClasses());
            setStoreResetDone(true);
            dispatch(logout());
        }
    }


    return (
        <NavbarContainer
            className={showMore ? "make-z-index-big" : ""}
        >
            <LogoSection>
                <NavigationLink
                    onClick={() => {
                        dispatch(resetDropdown());
                        dispatch(hideMoreMenu());
                    }}
                    className='logo-link'
                    to="/"
                >
                    <img className='logo-img' src={require("../assets/images/se-project-logo.svg").default} alt="Logo" />
                </NavigationLink>
                {(!showMore) ?
                    <MoreVertIcon
                        onClick={() => {
                            dispatch(toggleMore());
                            dispatch(hideSidebar());
                            dispatch(resetDropdown());
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </MoreVertIcon>
                    :
                    <CloseIcon
                        onClick={() => {
                            dispatch(toggleMore());
                            dispatch(hideSidebar());
                            dispatch(resetDropdown());
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </CloseIcon>
                }

                {
                    !isMobile
                    &&
                    <ButtonGroup>
                        {
                            user.role === "instructor"
                            &&
                            <DefaultStyledButton
                                onClick={() => {
                                    dispatch(toggleContent('create-class'));
                                    dispatch(hideMoreMenu());
                                    dispatch(resetDropdown());
                                }}
                            >
                                New Class
                            </DefaultStyledButton>
                        }
                        <DefaultStyledButton
                            onClick={() => {
                                dispatch(toggleContent('join-class'));
                                dispatch(hideMoreMenu());
                                dispatch(resetDropdown());
                            }}
                        >
                            Join Class
                        </DefaultStyledButton>
                    </ButtonGroup>
                }

            </LogoSection>

            <MoreSection
                id='more-menu'
                className={(showMore) ? "more-menu-is-open" : ""}
            >
                {/* render only if device is mobile */}
                {
                    isMobile
                    &&
                    <ButtonGroup>
                        {
                            user.role === "instructor"
                            &&
                            <DefaultStyledButton
                                onClick={() => {
                                    dispatch(toggleContent('create-class'));
                                    dispatch(hideMoreMenu());
                                    dispatch(resetDropdown());
                                }}
                            >
                                New Class
                            </DefaultStyledButton>
                        }
                        <DefaultStyledButton
                            onClick={() => {
                                dispatch(toggleContent('join-class'));
                                dispatch(hideMoreMenu());
                                dispatch(resetDropdown());
                            }}
                        >
                            Join Class
                        </DefaultStyledButton>
                    </ButtonGroup>
                }
                <NavList>
                    <NavClassContainer>

                        <NavItem
                            onClick={() => {
                                dispatch(toggleDropdown());
                            }}
                        >
                            My Classes
                        </NavItem>

                        {showClassDropdown && <ClassNavDropdown />}
                    </NavClassContainer>

                    {
                        joinedClasses.length !== 0
                        &&
                        currentClass != undefined
                        &&
                        currentClass !== null
                        &&
                        (
                            <>
                                <NavItem>
                                    <NavigationLink
                                        onClick={handleNavTabClick} to={`resources`}
                                    >
                                        Resources
                                    </NavigationLink>
                                </NavItem>
                                <NavItem>
                                    <NavigationLink
                                        onClick={handleNavTabClick} to={`statistics`}
                                    >
                                        Statistics
                                    </NavigationLink>
                                </NavItem>
                                {
                                    canManageClass
                                    &&
                                    <NavItem>
                                        <NavigationLink
                                            onClick={handleNavTabClick} to={`manage-class`}
                                        >
                                            Manage Class
                                        </NavigationLink>
                                    </NavItem>
                                }
                            </>
                        )
                    }
                </NavList>
                <div className='logout-div'>
                    <DefaultStyledButton
                        className='logout-btn'
                        onClick={handleLogout}
                    >
                        Logout
                    </DefaultStyledButton>
                </div>
            </MoreSection>
        </NavbarContainer>
    );
}

export default Navbar;
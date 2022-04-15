import React, { useEffect, useState } from 'react';
import ContentArea from './ContentArea';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import { DashboardMainWrapper, PostAndContentWrapper } from '../../components/styled/Dashboard.styled';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentClass, selectJoinedClasses, updateCurrentClass, updateJoinedClasses } from '../../features/classes/classSlice';
import { selectUser } from '../../features/user/userSlice';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toggleContent } from '../../features/mainContentToggle/mainContentToggleSlice';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getColRef } from '../../firebase/firebase-firestore';
import { getPosts, resetPosts, selectCurrentDiscussion } from '../../features/posts/postSlice';

function Dashboard() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isCurrentClassLoading, setIsCurrentClassLoading] = useState(true);
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);
    const currentDiscussion = useSelector(selectCurrentDiscussion);
    const [arePostsLoading, setArePostsLoading] = useState(true);

    useEffect(() => {
        const classColRef = getColRef('classes');
        const joinedClassQuery = query(
            classColRef,
            where('joined_users', 'array-contains', user.email),
            where('uni_id', '==', user.uni_id),
            orderBy('created_at', 'desc')
        );
        const unsubscribe = onSnapshot(joinedClassQuery, (snapshot) => {
            const promises = snapshot.docs.map((doc) => {
                return { ...doc.data(), c_id: doc.id };
            });
            Promise.all(promises)
                .then((joined_classes) => {
                    dispatch(updateJoinedClasses(joined_classes));
                    if (joined_classes.length !== 0) {
                        const localCurrentClass = JSON.parse(localStorage.getItem('currentClass'));
                        if (localCurrentClass === null || localCurrentClass == undefined) {
                            dispatch(updateCurrentClass(joined_classes[0]));
                        } else {
                            // check if the current class exists in joined class list
                            const currCls = joined_classes.filter(cls => cls.c_id === currentClass?.c_id);
                            if (currCls.length === 0) {
                                dispatch(updateCurrentClass(joined_classes[0]));
                            } else {
                                dispatch((updateCurrentClass(currCls[0])));
                                console.log('current class after update is : ', currCls[0]);
                            }
                        }
                    }
                    else {
                        dispatch(updateCurrentClass(null));
                    }
                    setIsCurrentClassLoading(false);
                }).catch((err) => {
                    console.log(err.message);
                })
        });

        return () => {
            console.log('dashboard unmounted.');
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!isCurrentClassLoading) {
            if (currentClass != undefined && currentClass !== null) {
                navigate(currentClass?.c_id);
            }
        }
    }, [isCurrentClassLoading]);


    useEffect(() => {
        console.log('inside change class useeffect');
        if (currentClass != undefined || currentClass !== null) {
            console.log('currentclass id :', currentClass.c_id);
            const postColRef = getColRef(`classes/${currentClass?.c_id}/posts`);
            const postQuery = query(
                postColRef,
                orderBy('created_at', 'desc')
            );

            const unsubscribe = onSnapshot(postQuery, (snapshot) => {
                const promises = snapshot.docs.map((doc) => {
                    return { ...doc.data(), p_id: doc.id };
                });
                Promise.all(promises)
                    .then((posts) => {
                        if (currentClass != undefined || currentClass !== null) {
                            dispatch(getPosts(posts));
                            console.log('all the posts are : ', posts);
                        } else {
                            dispatch(resetPosts());
                        }
                        setArePostsLoading(false);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    })
            });

            return () => {
                console.log('curr cls unmounted dashboard.');
                unsubscribe();
            };
        }
    }, [currentClass])

    useEffect(() => {
        dispatch(toggleContent('other'));
    }, [navigate])

    return (
        <>
            {
                (!isCurrentClassLoading)
                &&
                <>
                    <DashboardMainWrapper>
                        <Routes>
                            <Route path="/:c_id/*" element={<Navbar />} />
                            <Route path="*" element={<Navbar />} />
                        </Routes>
                        <PostAndContentWrapper>
                            <Routes>
                                <Route path="/:c_id/*" element={<Sidebar />} />
                                <Route path="*" element={<Sidebar />} />
                            </Routes>
                            <Routes>
                                <Route path="/:c_id/*" element={<ContentArea />} />
                                <Route path="*" element={<ContentArea />} />
                            </Routes>
                        </PostAndContentWrapper>
                    </DashboardMainWrapper>
                    {/* <Routes>
                <Route path="*" element={<Missing />} />
            </Routes> */}
                </>
            }
        </>
    );
}

export default Dashboard;
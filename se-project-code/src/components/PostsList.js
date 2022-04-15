import { onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCurrentClass } from '../features/classes/classSlice';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { getPosts, resetPosts, selectAllPosts, selectCurrentDiscussion } from '../features/posts/postSlice';
import { getColRef } from '../firebase/firebase-firestore';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { hideSidebar } from '../features/sidebar/sidebarSlice';

function PostsList({ searchTerm }) {
    const dispatch = useDispatch();
    const allPosts = useSelector(selectAllPosts);
    const currentDiscussion = useSelector(selectCurrentDiscussion);
    const currentClass = useSelector(selectCurrentClass);
    const navigate = useNavigate();
    const { c_id } = useParams();
    const [arePostsLoading, setArePostsLoading] = useState(true);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isActive, setIsActive] = useState('');

    useEffect(() => {
        if (searchTerm !== '') {
            // returns all posts whose summary and details contain search term
            setFilteredPosts(allPosts.filter(post => {
                return (post?.summary.toLowerCase().includes(searchTerm.toLowerCase())
                    ||
                    post?.details.toLowerCase().includes(searchTerm.toLowerCase()));
            }));
        } else {
            // show the posts from current discussion
            if (currentDiscussion === '') {
                setFilteredPosts([...allPosts]);
            } else {
                const newPostList = allPosts.filter(post => {
                    const isPresent = post?.discussion_list.includes(currentDiscussion);
                    return isPresent;
                });
                setFilteredPosts(newPostList);
            }
        }
    }, [searchTerm]);

    useEffect(() => {
        if (currentClass != undefined || currentClass !== null) {

            if (allPosts.length !== 0) {
                if (currentDiscussion === '') {
                    setFilteredPosts([...allPosts]);
                } else {
                    setFilteredPosts(allPosts.filter(post => {
                        post?.discussion_list.includes(currentDiscussion);
                    }));
                }
            }

            // console.log('currentclass id :', currentClass.c_id);
            // const postColRef = getColRef(`classes/${currentClass?.c_id}/posts`);
            // const postQuery = query(
            //     postColRef,
            //     orderBy('created_at', 'desc')
            // );

            // const unsubscribe = onSnapshot(postQuery, (snapshot) => {
            //     const promises = snapshot.docs.map((doc) => {
            //         return { ...doc.data(), p_id: doc.id };
            //     });
            //     Promise.all(promises)
            //         .then((posts) => {
            //             if (currentClass != undefined || currentClass !== null) {
            //                 dispatch(getPosts(posts));
            //                 console.log('all the posts are : ', posts);
            //                 if (posts.length !== 0) {
            //                     if (currentDiscussion === '') {
            //                         setFilteredPosts([...posts]);
            //                     } else {
            //                         setFilteredPosts(posts.filter(post => {
            //                             post?.discussion_list.includes(currentDiscussion);
            //                         }));
            //                     }
            //                 }
            //             } else {
            //                 dispatch(resetPosts());
            //             }
            //             setArePostsLoading(false);
            //         })
            //         .catch((err) => {
            //             console.log(err.message);
            //         })
            // });

            // return unsubscribe;
        }
    }, [currentClass, allPosts])

    useEffect(() => {
        console.log('all posts : ', allPosts);
        if (currentDiscussion === '') {
            setFilteredPosts([...allPosts]);
        } else {
            const newPostList = allPosts.filter(post => {
                const isPresent = post?.discussion_list.includes(currentDiscussion);
                return isPresent;
            });
            setFilteredPosts(newPostList);
        }
    }, [currentDiscussion]);


    return (
        <PostListContainer>
            {
                filteredPosts.length !== 0
                    ?
                    filteredPosts.map((post) => (
                        <StyledPostCard
                            key={post.p_id}
                            className={(isActive === post.p_id) ? `active-post` : ``}
                            onClick={() => {
                                setIsActive(post.p_id);
                                dispatch(hideSidebar());
                                dispatch(resetDropdown());
                                dispatch(toggleContent('other'));
                                navigate(`/dashboard/${c_id}/${post.p_id}`)
                            }}
                        >
                            <div className='inner-post-card'>
                                {post?.summary}
                            </div>
                            <div className='icon-div'>
                                {
                                    (post.total_comments === 0
                                        && (post.likes === 0)
                                        && (post.student_ans.length === 0)
                                        && (post.instructor_ans.length === 0))

                                    &&
                                    <svg
                                        className="exclamation-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>

                                }
                                {
                                    (post.instructor_ans.length !== 0)
                                    &&
                                    <svg
                                        className="instructor-ans-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M26,20.12C40.76,1.89,57.77-8,70.54,8.19,85.92,9,92.09,33.44,79.82,43.73l-.07.61a6.12,6.12,0,0,1,1.42-.27,4.4,4.4,0,0,1,2.51.47,3.56,3.56,0,0,1,1.75,2.12,6.42,6.42,0,0,1-.08,3.65c-.57,1.78-1.28,3.77-1.95,5.52a3.9,3.9,0,0,1-1.19,1.92,3.56,3.56,0,0,1-2.6.63l-.53-.06c-.13,6.07-3.09,8.86-7,12.51l-.18.17c3.61,9,10.59,11.29,17.53,12.45,23.63,4,20.34,16.57,20.34,28.68H78.73a25.8,25.8,0,0,1-39.19,3.2l-.22-.24a25.08,25.08,0,0,1-2.48-3H0C0,96.82-1.44,87,24.09,84.24c7.82-.84,15.63-2.93,18.87-13.7-3.54-3.07-6.44-5.86-7-12.2h-.33a4.57,4.57,0,0,1-2.24-.59,6.08,6.08,0,0,1-2.46-3,13.37,13.37,0,0,1-1-4.49v0c0-.48,0-1.39,0-2.26s.06-1.5.12-1.92a1.07,1.07,0,0,1,.1-.36c.79-2.22,2-2.94,3.62-2.89l-1.06-.7c-.58-7.18,1.11-19.64-6.69-22ZM56.24,86a3.87,3.87,0,0,1,.3-1.53,3.77,3.77,0,0,1,.87-1.29,4.28,4.28,0,0,1,1.28-.87,4,4,0,0,1,3,0,4.32,4.32,0,0,1,1.26.87,4,4,0,0,1,.85,1.29A3.83,3.83,0,0,1,64.07,86a4,4,0,0,1-.28,1.52,4.1,4.1,0,0,1-.86,1.29,4.05,4.05,0,0,1-1.26.88,3.71,3.71,0,0,1-1.49.3,3.83,3.83,0,0,1-2.79-1.17,3.94,3.94,0,0,1-.86-1.29A4,4,0,0,1,56.24,86Zm2.23,20.59-.14.55c-.07.46,0,1,.56,1a1.28,1.28,0,0,0,.71-.31,6.67,6.67,0,0,0,1-1,18.57,18.57,0,0,0,1.25-1.61c.44-.62.89-1.32,1.36-2.11a.18.18,0,0,1,.24-.06l1.61,1.19a.18.18,0,0,1,0,.24,29,29,0,0,1-2.23,3.35,15,15,0,0,1-2.31,2.38h0c-2.13,1.73-6.07,2.9-8.39.83-1.89-1.7-1.15-4.46-.51-6.55l2.09-6c.35-1.24,1.2-3.53-1-3.53H50.55a.19.19,0,0,1-.18-.18L51,92.58a.17.17,0,0,1,.17-.13l11.53-.36a.18.18,0,0,1,.19.17v.06l-4.39,14.29Zm-.69-31.29A21.78,21.78,0,1,1,36,97.09,21.77,21.77,0,0,1,57.78,75.32Z" />
                                    </svg>
                                }
                                {
                                    (post.student_ans.length !== 0)
                                    &&
                                    <svg
                                        className="student-ans-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M26,20.12C40.76,1.89,57.77-8,70.54,8.19,85.92,9,92.09,33.44,79.82,43.73l-.07.61a6.12,6.12,0,0,1,1.42-.27,4.4,4.4,0,0,1,2.51.47,3.56,3.56,0,0,1,1.75,2.12,6.42,6.42,0,0,1-.08,3.65c-.57,1.78-1.28,3.77-1.95,5.52a3.9,3.9,0,0,1-1.19,1.92,3.56,3.56,0,0,1-2.6.63l-.53-.06c-.13,6.07-3.09,8.86-7,12.51l-.18.17c3.61,9,10.59,11.29,17.53,12.45,23.63,4,20.34,16.57,20.34,28.68H78.73a25.8,25.8,0,0,1-39.19,3.2l-.22-.24a25.08,25.08,0,0,1-2.48-3H0C0,96.82-1.44,87,24.09,84.24c7.82-.84,15.63-2.93,18.87-13.7-3.54-3.07-6.44-5.86-7-12.2h-.33a4.57,4.57,0,0,1-2.24-.59,6.08,6.08,0,0,1-2.46-3,13.37,13.37,0,0,1-1-4.49v0c0-.48,0-1.39,0-2.26s.06-1.5.12-1.92a1.07,1.07,0,0,1,.1-.36c.79-2.22,2-2.94,3.62-2.89l-1.06-.7c-.58-7.18,1.11-19.64-6.69-22ZM56.24,86a3.87,3.87,0,0,1,.3-1.53,3.77,3.77,0,0,1,.87-1.29,4.28,4.28,0,0,1,1.28-.87,4,4,0,0,1,3,0,4.32,4.32,0,0,1,1.26.87,4,4,0,0,1,.85,1.29A3.83,3.83,0,0,1,64.07,86a4,4,0,0,1-.28,1.52,4.1,4.1,0,0,1-.86,1.29,4.05,4.05,0,0,1-1.26.88,3.71,3.71,0,0,1-1.49.3,3.83,3.83,0,0,1-2.79-1.17,3.94,3.94,0,0,1-.86-1.29A4,4,0,0,1,56.24,86Zm2.23,20.59-.14.55c-.07.46,0,1,.56,1a1.28,1.28,0,0,0,.71-.31,6.67,6.67,0,0,0,1-1,18.57,18.57,0,0,0,1.25-1.61c.44-.62.89-1.32,1.36-2.11a.18.18,0,0,1,.24-.06l1.61,1.19a.18.18,0,0,1,0,.24,29,29,0,0,1-2.23,3.35,15,15,0,0,1-2.31,2.38h0c-2.13,1.73-6.07,2.9-8.39.83-1.89-1.7-1.15-4.46-.51-6.55l2.09-6c.35-1.24,1.2-3.53-1-3.53H50.55a.19.19,0,0,1-.18-.18L51,92.58a.17.17,0,0,1,.17-.13l11.53-.36a.18.18,0,0,1,.19.17v.06l-4.39,14.29Zm-.69-31.29A21.78,21.78,0,1,1,36,97.09,21.77,21.77,0,0,1,57.78,75.32Z" />
                                    </svg>
                                }
                            </div>
                        </StyledPostCard>
                    ))
                    :
                    (
                        <div>No Posts Yet...</div>
                    )
            }
        </PostListContainer>
    );
}

export default PostsList;
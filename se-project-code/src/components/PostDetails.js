import React, { useEffect, useState } from 'react';
import Comments from './Comments/Comments';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllPosts } from '../features/posts/postSlice';
import { getColRef, getDocRefById } from '../firebase/firebase-firestore';
import { arrayRemove, arrayUnion, deleteDoc, getDocs, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { selectCurrentClass } from '../features/classes/classSlice';
import { selectUser } from '../features/user/userSlice';
import { EditDeleteBtnGroup, PostBox, PostDetailsContainer } from './styled/PostDetails.styled';
import { TextBox } from './styled/TextBox';
import { LikeBtn } from './styled/LikeBtn';
import { DeleteIcon } from './styled/DeleteIcon';
import { EditIcon } from './styled/EditIcon';
import { InputField } from '../components/styled/InputField';
import { FieldLabel } from '../components/styled/FieldLabel';
import { DashboardFormButton } from '../components/styled/DashboardFormButton.styled';

function PostDetails() {

    useEffect(() => {
        // in case the posts aren't fetched
        // then to prevent app from crashing, just navigate back to dashboard
        // after that all posts will be loaded and you can view all of them successfully
        // but the downside is that if you were already doing something, it won't be saved
        if (allPosts == undefined || allPosts.length === 0) {
            navigate('/');
        }
    }, []);

    // variables below
    const { c_id, p_id } = useParams();
    const allPosts = useSelector(selectAllPosts);
    const post = allPosts?.filter(p => p.p_id === p_id)[0];
    const navigate = useNavigate();
    const [openEdit, setOpenEdit] = useState(false);
    const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);
    const isLikedByMe = post?.liked_by.includes(user.email);
    const [isLiked, setIsLiked] = useState(isLikedByMe);
    const [isUpdatingLikes, setIsUpdatingLikes] = useState(false);
    const [studAns, setStudAns] = useState(post?.student_ans)
    const [instructorAns, setInstructorAns] = useState(post?.instructor_ans)
    const isInstructor = currentClass?.instructors_list?.includes(user.email);
    const [updatingStudAns, setUpdatingStudAns] = useState(false);
    const [updatingInstructorAns, setUpdatingInstructorAns] = useState(false);
    const [showSaveBtn, setShowSaveBtn] = useState(false);

    const discussions = currentClass?.discussions.map(discussion => ({
        value: discussion,
        label: discussion,
    }));

    const initialFormDiscussionList = post?.discussion_list.map((dis) => ({
        value: dis,
        label: dis
    }));
    const [discussionList, setDiscussionList] = useState(initialFormDiscussionList);

    let nameOptions = [
        { value: user.email, label: user.email },
    ];
    // if current class has anonymity on
    if (currentClass?.anonymity) {
        nameOptions.push({ value: 'Anonymous', label: 'Anonymous' });
    }

    const initialShowName = {
        value: post?.show_name_as,
        label: post?.show_name_as
    };
    const [showName, setShowName] = useState(initialShowName);
    const [isValidationComplete, setIsValidationComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialFormData = {
        updated_at: serverTimestamp(),
        type: post?.type,
        summary: post?.summary,
        details: post?.details,
        discussion_list: [],
        show_name_as: post?.show_name_as,
    };
    const [formData, setFormData] = useState(initialFormData);

    const { type, summary, details } = formData;
    const isChecked = (postType) => {
        if (postType === type) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        setStudAns(post?.student_ans);
        setInstructorAns(post?.instructor_ans);
        setFormData(initialFormData);
        setOpenEdit(false);
    }, [post?.p_id]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDelete = () => {
        const isOkayToDelete = window.confirm('Are you sure you want to delete the post?\nAll the comments will also be gone...');
        if (isOkayToDelete) {
            console.log('post is : ', post);
            const totalDeletedContributions = post.total_comments + 1;

            const postDocRef = getDocRefById(p_id, `classes/${c_id}/posts`);

            // delete all the comments
            const deleteComments = async () => {
                const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
                const snapshot = await getDocs(commentsColRef);
                if (snapshot.docs.length > 0) {
                    const promises = snapshot.docs.map(async (doc) => {
                        const commentDocRef = getDocRefById(doc.id, `classes/${c_id}/posts/${p_id}/comments`);
                        await deleteDoc(commentDocRef);
                        return doc.id;
                    });
                    const deletedCommentsId = await Promise.all(promises);
                }
            };
            deleteComments()
                .then(() => {
                    // now delete the post
                    deleteDoc(postDocRef)
                        .then(() => {
                            const classDocRef = getDocRefById(c_id, 'classes');
                            updateDoc(classDocRef, {
                                total_posts: increment(-1),
                                total_deleted_contributions: increment(totalDeletedContributions)
                            })
                                .then(navigate('/'))
                        })
                        .catch(err => console.log(err.message))
                })
                .catch(err => console.log(err.message))
        }
    };

    useEffect(() => {
        if (isValidationComplete) {
            const editPost = async () => {
                const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
                if (
                    (formData.type === 'note' && post?.type === 'question')
                    ||
                    (formData.type === 'question' && post?.type === 'note')
                ) {
                    const newData = { ...formData, student_ans: '', instructor_ans: '' };
                    await updateDoc(postDocRef, newData);
                } else {
                    await updateDoc(postDocRef, formData);
                }
                setIsLoading(false);
                setStudAns(post?.student_ans);
                setInstructorAns(post?.instructor_ans);
                // setDiscussionList(initialFormDiscussionList);
                // setShowName(initialShowName);
                // setFormData(initialFormData);
                setOpenEdit(false);
                setIsValidationComplete(false);
            }
            editPost();
        }
    }, [isValidationComplete]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);
        const finalDiscussions = discussionList?.map(discussion => discussion.value);

        setFormData((prevState) => {
            const newFormData = {
                ...prevState,
                show_name_as: showName.value,
                discussion_list: finalDiscussions,
            };
            setIsValidationComplete(true);
            return newFormData;
        });
    };

    const likePost = () => {
        const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
        setIsUpdatingLikes(true);
        if (!isLiked) {
            const likeIt = async () => {
                // increment post's like count by 1 and store user's email in post's liked_by array
                await updateDoc(postDocRef, {
                    likes: increment(1),
                    liked_by: arrayUnion(user.email)
                });
                setIsLiked(true);
                setIsUpdatingLikes(false);
            }
            likeIt();
        } else if (isLiked) {
            const unLikeIt = async () => {
                // decrement post's like count by 1 and remove user's email from post's liked_by array
                await updateDoc(postDocRef, {
                    likes: increment(-1),
                    liked_by: arrayRemove(user.email)
                });
                setIsLiked(false);
                setIsUpdatingLikes(false);
            }
            unLikeIt();
        }
    };

    const submitStudAns = (e) => {
        e.preventDefault();
        setUpdatingStudAns(true);
        const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
        const updateIt = async () => {
            await updateDoc(postDocRef, {
                student_ans: studAns,
            });
            setUpdatingStudAns(false);
            setShowSaveBtn(false);
        }
        updateIt();
    };

    const submitInstructorAns = (e) => {
        e.preventDefault();
        setUpdatingInstructorAns(true);
        const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
        const updateIt = async () => {
            await updateDoc(postDocRef, {
                instructor_ans: instructorAns,
            });
            setUpdatingInstructorAns(false);
            setShowSaveBtn(false);
        }
        updateIt();
    };

    return (
        <>
            {
                !openEdit
                &&
                <>
                    <PostDetailsContainer>
                        <PostBox>
                            <div className='post__content'>
                                <div className='post__summary'>{post?.summary}</div>
                                <div className='post__details'>{post?.details}</div>
                            </div>
                            <div
                                className='post-btn-container'
                            >
                                <div>

                                    <LikeBtn
                                        className={(isLiked) ? 'liked' : ''}
                                        aria-disabled={isUpdatingLikes}
                                        onClick={likePost}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                        />
                                    </LikeBtn>
                                    <span>{post?.likes}</span>
                                </div>
                                {
                                    post?.created_by === user.email
                                    &&
                                    <EditDeleteBtnGroup>
                                        <EditIcon
                                            onClick={() => setOpenEdit(true)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </EditIcon>
                                        <DeleteIcon
                                            onClick={handleDelete}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </DeleteIcon>
                                    </EditDeleteBtnGroup>
                                }
                            </div>
                        </PostBox>

                        {
                            post?.type === 'question'
                            &&
                            <>
                                <form onSubmit={submitStudAns}>
                                    <div>
                                        <TextBox
                                            disabled={(isInstructor)}
                                            cols="30"
                                            rows="10"
                                            placeholder="Students answer here!"
                                            name="stud_ans"
                                            value={studAns}
                                            onChange={(e) => setStudAns(e.target.value)}
                                            onFocus={() => setShowSaveBtn(true)}
                                        >
                                        </TextBox>
                                    </div>
                                    {
                                        !isInstructor && showSaveBtn
                                        &&
                                        <>
                                            <DashboardFormButton disabled={updatingStudAns} type='submit'>Save</DashboardFormButton>
                                            <DashboardFormButton
                                                className='mg-left-btn'
                                                onClick={() => {
                                                    setStudAns(post?.student_ans);
                                                    setShowSaveBtn(false);
                                                }}
                                            >Cancel</DashboardFormButton>
                                        </>
                                    }
                                </form>
                                <form onSubmit={submitInstructorAns}>
                                    <div>
                                        <TextBox
                                            disabled={(!isInstructor)}
                                            cols="30"
                                            rows="10"
                                            placeholder="Instructors answer here!"
                                            name="inst_ans"
                                            value={instructorAns}
                                            onChange={(e) => setInstructorAns(e.target.value)}
                                            onFocus={() => setShowSaveBtn(true)}
                                        >
                                        </TextBox>
                                    </div>
                                    {
                                        isInstructor && showSaveBtn
                                        &&
                                        <>
                                            <DashboardFormButton disabled={updatingInstructorAns} type='submit'>Save</DashboardFormButton>
                                            <DashboardFormButton
                                                className='mg-left-btn'
                                                onClick={() => {
                                                    setInstructorAns(post?.instructor_ans);
                                                    setShowSaveBtn(false);
                                                }}
                                            >Cancel</DashboardFormButton>
                                        </>
                                    }
                                </form>
                            </>
                        }
                    </PostDetailsContainer>
                    <Comments postType={post?.type} />
                </>
            }
            {
                openEdit
                &&
                <div className='edit-post_form_wrapper'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <FieldLabel>Post type : </FieldLabel>
                            <input type="radio" id="question"
                                name="type"
                                value="question"
                                checked={isChecked('question')}
                                onChange={onChange}
                            />
                            <label htmlFor="question">Question</label>

                            {/* <input type="radio" id="poll" name="type" value="question" />
                        <label htmlFor="poll">Poll</label> */}

                            <input type="radio" id="note"
                                name="type"
                                value="note"
                                checked={isChecked('note')}
                                onChange={onChange}
                            />
                            <label htmlFor="note">Note</label>
                        </div>
                        <div>
                            <FieldLabel>Select Discussion : </FieldLabel>
                            <Select
                                components={makeAnimated()}
                                value={discussionList}
                                options={discussions}
                                onChange={setDiscussionList}
                                placeholder='Please select discussion(s)'
                                noOptionsMessage={() => 'No discussions to select...'}
                                isMulti
                                isSearchable
                            />
                        </div>
                        <div>
                            <FieldLabel className='edit-post__summary'>Summary : </FieldLabel>
                            <InputField
                                id='edit-post__summary'
                                type="text"
                                placeholder="Enter the summary here"
                                name="summary"
                                value={summary}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <FieldLabel className='edit-post__details'>Details : </FieldLabel>
                            <TextBox
                                id='edit-post__details'
                                cols="30"
                                rows="10"
                                placeholder="Enter the details here"
                                name="details"
                                value={details}
                                onChange={onChange}
                                required
                            >
                            </TextBox>
                        </div>
                        <div>
                            <FieldLabel>Show my name as : </FieldLabel>
                            <Select
                                value={showName}
                                options={nameOptions}
                                onChange={setShowName}
                                placeholder='Please select show name(s)'
                            />
                        </div>
                        <DashboardFormButton className='mg-top-btn' disabled={isLoading} type="submit">Save</DashboardFormButton>
                        <DashboardFormButton
                            className='mg-top-btn'
                            className='mg-left-btn'
                            type='button'
                            onClick={() => {
                                setDiscussionList(initialFormDiscussionList);
                                setShowName(initialShowName);
                                setFormData(initialFormData);
                                setOpenEdit(false);
                            }}
                        >
                            Cancel
                        </DashboardFormButton>
                    </form>
                </div>

            }
        </>
    );
}

export default PostDetails;
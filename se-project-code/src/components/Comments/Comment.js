import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { StyledPostCard } from '../styled/PostList.styled';
import { selectUser } from '../../features/user/userSlice';
import CommentForm from './CommentForm';
import { useParams } from 'react-router-dom';
import { selectCurrentClass } from '../../features/classes/classSlice';
import { getDocRefById } from '../../firebase/firebase-firestore';
import { arrayRemove, arrayUnion, increment, updateDoc } from 'firebase/firestore';
import { LikeBtn } from '../styled/LikeBtn';
import { EditIcon } from '../styled/EditIcon';
import { DeleteIcon } from '../styled/DeleteIcon';
import { CommentContainer } from '../styled/Comments.styled';

function Comment({
    comment,
    postType,
    replies,
    addComment,
    deleteComment,
    updateComment,
    activeComment,
    setActiveComment,
    parentId = null,
}) {
    const user = useSelector(selectUser);
    const { p_id } = useParams();
    const currentClass = useSelector(selectCurrentClass);
    const canReply = Boolean(user?.uid);
    const canEdit = user.email === comment.created_by;
    const canDelete = user.email === comment.created_by;
    const isReplying = activeComment && activeComment.type === 'replying' && activeComment.id === comment.id;
    const isEditing = activeComment && activeComment.type === 'editing' && activeComment.id === comment.id;
    const replyId = parentId ? parentId : comment.id;
    const [showReplies, setShowReplies] = useState(false);

    const isLikedByMe = comment.liked_by.includes(user.email);
    const [isLiked, setIsLiked] = useState(isLikedByMe);
    const [isUpdatingLikes, setIsUpdatingLikes] = useState(false);

    const likeComment = () => {
        const commentDocRef = getDocRefById(comment.id, `classes/${currentClass.c_id}/posts/${p_id}/comments`);
        setIsUpdatingLikes(true);
        if (!isLiked) {
            const likeIt = async () => {
                // increment comment's like count by 1 and store user's email in comment's liked_by array
                await updateDoc(commentDocRef, {
                    likes: increment(1),
                    liked_by: arrayUnion(user.email)
                });
                setIsLiked(true);
                setIsUpdatingLikes(false);
            }
            likeIt();
        } else if (isLiked) {
            const unLikeIt = async () => {
                // decrement comment's like count by 1 and remove user's email from comment's liked_by array
                await updateDoc(commentDocRef, {
                    likes: increment(-1),
                    liked_by: arrayRemove(user.email)
                });
                setIsLiked(false);
                setIsUpdatingLikes(false);
            }
            unLikeIt();
        }
    };

    return (
        <>
            <CommentContainer>
                {!isEditing &&
                    <div className='comment__container'>
                        <p className='comment__created-by'>created by : {comment?.show_name_as}</p>
                        <br />
                        <p className='comment__body'>body : {comment.body}</p>
                    </div>
                }
                {isEditing && (
                    <CommentForm
                        submitLabel={'Update'}
                        hasCancelButton
                        handleCancel={() => setActiveComment(null)}
                        initialText={comment.body}
                        handleSubmit={(showName, text) => updateComment(showName, text, comment.id)}
                    />
                )}
                <br />
                <div
                    className='comment-btn-container'
                >
                    <div>
                        <LikeBtn
                            className={(isLiked) ? 'liked' : ''}
                            aria-disabled={isUpdatingLikes}
                            onClick={likeComment}
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
                        <span>{comment?.likes}</span>
                        {
                            postType !== 'note'
                            &&
                            canReply
                            &&
                            <span
                                className='reply-btn-span'
                                onClick={() => {
                                    setActiveComment({ id: comment.id, type: "replying" });
                                }}
                            >
                                Reply
                            </span>
                        }
                    </div>
                    <div>

                        {
                            postType !== 'note'
                            &&
                            <>
                                {
                                    canEdit
                                    &&
                                    <EditIcon
                                        onClick={() => { setActiveComment({ id: comment.id, type: "editing" }) }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </EditIcon>
                                }
                            </>
                        }
                        {
                            canDelete
                            &&
                            <DeleteIcon
                                onClick={() => { deleteComment(comment.id) }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </DeleteIcon>
                        }
                    </div>
                </div>
                {isReplying && (
                    <div className="reply-comment-form">
                        <CommentForm
                            hasCancelButton
                            handleCancel={() => setActiveComment(null)}
                            submitLabel={'Reply'}
                            handleSubmit={(showName, text) => addComment(showName, text, replyId)}
                        />
                    </div>
                )}
                {
                    replies.length > 0
                    &&
                    <div
                        className="view-replies-toggle"
                        onClick={() => setShowReplies(!showReplies)}
                    >
                        {
                            showReplies
                                ? <>
                                    <svg
                                        className='arrow-icon'
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                    </svg>
                                    Hide Replies
                                </>
                                : <>
                                    <svg
                                        className='arrow-icon'
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    View Replies
                                </>
                        }
                    </div>
                }


                {showReplies && replies.length > 0 && (
                    <div className='comment__replies'>
                        {replies.map(reply => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                postType={postType}
                                replies={[]}
                                addComment={addComment}
                                deleteComment={deleteComment}
                                updateComment={updateComment}
                                parentId={comment.id}
                                activeComment={activeComment}
                                setActiveComment={setActiveComment}
                            />
                        ))}
                    </div>
                )}
            </CommentContainer>
        </>
    );
}


export default Comment;
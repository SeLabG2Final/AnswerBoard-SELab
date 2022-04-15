import { addDoc, setDoc, deleteDoc, getDocs, orderBy, query, serverTimestamp, increment, where, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../features/user/userSlice';
import { getColRef, getDocRefById } from '../../firebase/firebase-firestore';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { v4 as uuidV4 } from 'uuid';
import { CommentsWrapper } from '../styled/Comments.styled';

function Comments({ postType }) {
    const user = useSelector(selectUser);
    const { c_id, p_id } = useParams();
    const [backendComments, setBackendComments] = useState([]);
    const rootComments = backendComments.filter((backendComment) => backendComment.parent_id === null);
    const [activeComment, setActiveComment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // get all comments from backend
        const loadComments = async () => {
            const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
            const commentsQuery = query(
                commentsColRef,
                orderBy('created_at')
            );
            const commentsColSnapshot = await getDocs(commentsQuery);
            const promises = commentsColSnapshot.docs.map((doc) => {
                return { ...doc.data(), id: doc.id };
            });
            const allComments = await Promise.all(promises);
            setBackendComments(allComments);
        }
        loadComments();
    }, [p_id, backendComments]);

    const getReplies = commentId => {
        const replies = backendComments.filter(backendComment => backendComment?.parent_id === commentId);
        return replies;
    }

    const addComment = (showName, text, parentId = null) => {
        // add to database
        const commentData = {
            body: text,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: user.email,
            show_name_as: showName,
            liked_by: [],
            likes: 0,
            parent_id: parentId,
            post_id: p_id,
        };

        const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
        addDoc(commentsColRef, commentData)
            .then((docRef) => {
                const newComment = { ...commentData, id: docRef.id }
                setBackendComments([...backendComments, newComment]);

                const updateStats = async () => {
                    // update individual contributions
                    const individualStatsCommentsIncrement = async () => {
                        const individualStatsColRef = getColRef(`classes/${c_id}/individual_stats`);
                        const queryIndividualStats = query(individualStatsColRef, where('user', '==', user.email));
                        const individualStatsSnapshot = await getDocs(queryIndividualStats);
                        let id;
                        if (individualStatsSnapshot.docs.length > 0) {
                            id = individualStatsSnapshot.docs.at(0).id;
                        } else {
                            // if in case the person had anonymous posts or contributions before, this will create new individual stats for them
                            id = uuidV4();
                        }
                        const individualStatsDocRef = getDocRefById(id, `classes/${c_id}/individual_stats`);
                        await setDoc(individualStatsDocRef, {
                            user: user.email,
                            total_contributions: increment(1)
                        }, { merge: true });
                    }

                    if (showName !== 'Anonymous') {
                        individualStatsCommentsIncrement();
                    }

                    // update post comment count
                    const postRef = getDocRefById(p_id, `classes/${c_id}/posts`);
                    await updateDoc(postRef, {
                        total_comments: increment(1)
                    });

                    // update class contributions
                    const classDocRef = getDocRefById(c_id, 'classes');
                    if (showName === 'Anonymous') {
                        await updateDoc(classDocRef, {
                            total_contributions: increment(1),
                            total_anonymous_contributions: increment(1)
                        });
                    } else {
                        await updateDoc(classDocRef, {
                            total_contributions: increment(1)
                        });
                    }
                }
                updateStats();
            })
            .catch(err => console.log(err.message));

        setActiveComment(null);
    };

    const deleteComment = (commentId) => {
        const isOkayToDelete = window.confirm('Are you sure you want to delete the comment?');
        if (isOkayToDelete) {
            // delete from database
            const deleteCommentStart = async () => {
                setIsLoading(true);
                const deleteCommentDocRef = getDocRefById(commentId, `classes/${c_id}/posts/${p_id}/comments`);

                const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
                const queryChildComments = query(commentsColRef, where('parent_id', '==', commentId));
                let deletedCommentsCount = 0;
                try {
                    const snapshot = await getDocs(queryChildComments);
                    // if there are any child comments then
                    if (snapshot.docs.length > 0) {
                        const promises = snapshot.docs.map(async (doc) => {
                            const childCommentDocRef = getDocRefById(doc.id, `classes/${c_id}/posts/${p_id}/comments`);
                            // delete child comments from db
                            await deleteDoc(childCommentDocRef);
                            return doc.id;
                        });

                        // add the child comments to deleted list
                        let deletedList = await Promise.all(promises);
                        deletedCommentsCount = deletedList.length;
                        // after deleting child comments, delete parent too
                        await deleteDoc(deleteCommentDocRef);

                        // now add the parent to the local deleted list too
                        deletedList.push(commentId);
                        deletedCommentsCount += 1;
                        // filter the final local list after deleting the comments
                        const commentListAfterDeleting = backendComments.filter((backendComment) => !deletedList.includes(backendComment.id));
                        setBackendComments([...commentListAfterDeleting]);
                    } else {
                        // if there are no child comments, then just delete the parent
                        await deleteDoc(deleteCommentDocRef);
                        deletedCommentsCount = 1;
                        // and filter the final local list after deleting the comments
                        const commentListAfterDeleting = backendComments.filter((backendComment) => backendComment.id !== commentId);
                        setBackendComments([...commentListAfterDeleting]);
                    }

                    const updateStats = async () => {
                        // update post comment count
                        const postRef = getDocRefById(p_id, `classes/${c_id}/posts`);
                        await updateDoc(postRef, {
                            total_comments: increment(-deletedCommentsCount)
                        });

                        // update class contributions
                        const classDocRef = getDocRefById(c_id, 'classes');
                        await updateDoc(classDocRef, {
                            total_deleted_contributions: increment(deletedCommentsCount)
                        });

                        setIsLoading(false);
                    }
                    updateStats();
                } catch (err) {
                    console.log(err.message);
                }
            }
            deleteCommentStart();
        }
    };

    const updateComment = (showName, text, commentId) => {
        // update comment in database

        setIsLoading(true);
        const commentData = backendComments.filter((backendComment) => backendComment.id === commentId)[0];
        const updatedComment = {
            ...commentData,
            body: text,
            show_name_as: showName,
            updated_at: serverTimestamp(),
        };
        const updateCommentDocRef = getDocRefById(commentId, `classes/${c_id}/posts/${p_id}/comments`);
        setDoc(updateCommentDocRef, updatedComment)
            .then(() => {
                const updatedBackendComments = backendComments.map((backendComment) => {
                    if (backendComment.id === commentId) {
                        return updatedComment;
                    } else {
                        return backendComment;
                    }
                });
                setBackendComments(updatedBackendComments);
                setIsLoading(false);
                setActiveComment(null);
            })
            .catch(err => {
                console.log(err.message);
                setIsLoading(false);
                setActiveComment(null);
            });

    }

    return (
        <CommentsWrapper>
            <h4>Comments</h4>
            <CommentForm
                postType={postType}
                submitLabel={"Comment"}
                handleSubmit={(showName, text) => addComment(showName, text)}
            />
            {
                !isLoading
                &&
                <>
                    {rootComments.map((rootComment) => (
                        <Comment
                            key={rootComment.id}
                            postType={postType}
                            comment={rootComment}
                            replies={getReplies(rootComment.id)}
                            addComment={addComment}
                            deleteComment={deleteComment}
                            updateComment={updateComment}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                        />
                    ))}
                </>
            }
        </CommentsWrapper>
    );
}

export default Comments;
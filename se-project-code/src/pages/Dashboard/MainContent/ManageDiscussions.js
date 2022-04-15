import { arrayRemove, deleteDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Discussion from '../../../components/Discussion';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { selectAllPosts } from '../../../features/posts/postSlice';
import { getDocRefById } from '../../../firebase/firebase-firestore';
import { InputField } from '../../../components/styled/InputField';
import { DashboardFormButton } from '../../../components/styled/DashboardFormButton.styled';
import styled from 'styled-components';

function ManageDiscussions() {
    const currentClass = useSelector(selectCurrentClass);
    const discussionList = [...currentClass.discussions];
    const [openEdit, setOpenEdit] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const allPosts = useSelector(selectAllPosts);
    const [currentInput, setCurrentInput] = useState('');

    const handleEdit = (e, discussion, editedName) => {
        e.preventDefault();

        setIsEditing(true);

        const newDiscussionList = [editedName, ...discussionList.filter(dis => dis !== discussion)];
        console.log(newDiscussionList);

        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        updateDoc(classDocRef, {
            discussions: [...newDiscussionList]
        })
            .then(async () => {
                // now edit this discussion in all posts too
                const filteredPosts = allPosts.map(post => {
                    // if post's discussion list has this discussion,
                    if (post.discussion_list.includes(discussion)) {
                        // then remove that discussion and add updated discussion to it return the new list
                        const postDiscussions = post.discussion_list.filter(dis => dis !== discussion);
                        return { id: post.p_id, post_discussions: [editedName, ...postDiscussions] }
                    }
                });

                // now just update all posts with given ids
                await filteredPosts.map(async (post) => {
                    const postDocRef = getDocRefById(post.id, `classes/${currentClass.c_id}/posts`);
                    await updateDoc(postDocRef, {
                        discussion_list: [...post.post_discussions]
                    })
                });

                setIsEditing(false);
                resetEdit();
            })
            .catch(err => {
                console.log(err.message);
                setIsEditing(false);
                resetEdit();
            })

        resetEdit();
    };

    const handleDelete = (discussion) => {
        const classDocRef = getDocRefById(currentClass.c_id, 'classes');

        updateDoc(classDocRef, {
            discussions: arrayRemove(discussion)
        })
            .then(async () => {
                // now remove this discussion from all the posts too
                const filteredPosts = allPosts.map(post => {
                    if (post.discussion_list.includes(discussion)) {
                        return post.p_id
                    }
                });

                await filteredPosts.map(async (id) => {
                    const postDocRef = getDocRefById(id, `classes/${currentClass.c_id}/posts`);
                    await updateDoc(postDocRef, {
                        discussion_list: arrayRemove(discussion)
                    })
                });
                resetEdit();
            })
            .catch(err => {
                console.log(err.message);
                resetEdit();
            })
    };

    const createDiscussion = (e) => {
        e.preventDefault();

        if (discussionList.includes(newDiscussion)) {
            alert(`You've already created a discussion with same name.`);
            return;
        }

        setIsCreating(true);

        const newDiscussionList = [...discussionList, newDiscussion];
        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        updateDoc(classDocRef, {
            discussions: [...newDiscussionList]
        })
            .then(() => {
                setIsCreating(false);
                setNewDiscussion('');
                resetEdit();
            })
            .catch(err => {
                console.log(err.message);
                setIsCreating(false);
                setNewDiscussion('');
                resetEdit();
            })

    };

    const resetEdit = () => {
        setCurrentInput('');
        setOpenEdit(false);
    }

    return (
        <div>
            <form onSubmit={createDiscussion}>
                <InputField
                    type="text"
                    value={newDiscussion}
                    onChange={(e) => setNewDiscussion(e.target.value)}
                    onFocus={() => { resetEdit() }}
                    required
                />
                <DashboardFormButton disabled={isCreating} type="submit">Create Discussion</DashboardFormButton>
            </form>
            <DiscussionListContainerManage>

                {
                    discussionList.length > 0
                        ? discussionList.map(discussion => (
                            <div key={discussion}>
                                <Discussion
                                    discussion={discussion}
                                    currentInput={currentInput}
                                    setCurrentInput={setCurrentInput}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    resetEdit={resetEdit}
                                    isEditing={isEditing}
                                />
                            </div>
                        ))
                        : (
                            <div>No created discussions. Create some discussions below!</div>
                        )
                }
            </DiscussionListContainerManage>
        </div>
    );
}

const DiscussionListContainerManage = styled.div`
    margin-left: calc(var(--post-card-margin) / 2);
    margin-top: var(--post-card-margin);
    display: flex;
    flex-direction: column;
`

export default ManageDiscussions;
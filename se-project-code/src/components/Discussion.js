import React, { useState } from 'react';
import { EditIcon } from '../components/styled/EditIcon';
import { DeleteIcon } from './styled/DeleteIcon';
import styled from 'styled-components';
import { InputField } from './styled/InputField';

function Discussion({
    discussion,
    currentInput,
    setCurrentInput,
    handleEdit,
    handleDelete,
    resetEdit,
    isEditing,
}) {
    const [openEdit, setOpenEdit] = useState(false);
    const [editedName, setEditedName] = useState('');

    return (
        <DiscussionContainer>
            <DiscussionItem>

                <div>{discussion}</div>
                <div>

                    <EditIcon
                        onClick={() => {
                            setOpenEdit(true);
                            setCurrentInput(discussion);
                            setEditedName(discussion);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </EditIcon>
                    <DeleteIcon
                        onClick={() => { handleDelete(discussion) }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </DeleteIcon>
                </div>
            </DiscussionItem>
            {
                currentInput === discussion
                &&
                openEdit
                &&
                <form onSubmit={(e) => handleEdit(e, discussion, editedName)}>
                    <InputField
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}

                    />
                    <button disabled={isEditing} type="submit">Update</button>
                    <button
                        type='button'
                        onClick={() => {
                            resetEdit();
                            setOpenEdit(false);
                        }}
                    >
                        Cancel
                    </button>
                </form>
            }
        </DiscussionContainer>
    );
}

const DiscussionContainer = styled.div`
    margin-top: var(--post-card-margin);
    display: flex;
    flex-direction: column;
`

const DiscussionItem = styled.div`
    /* margin-top: var(--post-card-margin); */
    display: flex;
    justify-content: space-between;
`

export default Discussion;
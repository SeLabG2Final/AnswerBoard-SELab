import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { selectCurrentClass } from '../../features/classes/classSlice';
import { selectUser } from '../../features/user/userSlice';
import { TextBox } from '../styled/TextBox';
import { DashboardFormButton } from '../styled/DashboardFormButton.styled';

function CommentForm({ postType, submitLabel, handleSubmit, hasCancelButton = false, initialText = '', handleCancel }) {
    const [text, setText] = useState(initialText);
    const user = useSelector(selectUser);
    const currentClass = useSelector(selectCurrentClass);

    let nameOptions = [
        { value: user.email, label: user.email },
    ];
    // if current class has anonymity on
    if (currentClass?.anonymity) {
        nameOptions.push({ value: 'Anonymous', label: 'Anonymous' });
    }

    const [showName, setShowName] = useState('');
    const isTextareaDisabled = text?.length === 0 || showName?.length === 0 || text === null || showName === null;
    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(showName.value, text);
        setText('');
    };
    return <form onSubmit={onSubmit}>
        <TextBox
            disabled={postType === 'note'}
            value={text}
            placeholder={'Comment here...'}
            onChange={(e) => setText(e.target.value)}
        />
        <Select
            options={nameOptions}
            onChange={setShowName}
            placeholder='Please select show name(s)'
            isClearable
        />
        <DashboardFormButton className='mg-top-btn' disabled={isTextareaDisabled}>{submitLabel}</DashboardFormButton>
        {hasCancelButton && (
            <DashboardFormButton
                type="button"
                className='mg-left-btn'
                onClick={handleCancel}
            >
                Cancel
            </DashboardFormButton>
        )}
    </form>;
}

export default CommentForm;

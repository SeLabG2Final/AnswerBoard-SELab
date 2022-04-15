import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { selectUser } from '../../../features/user/userSlice';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { addDoc, getDocs, increment, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { getColRef, getDocRefById } from '../../../firebase/firebase-firestore';
import { toggleContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { resetDropdown } from '../../../features/classDropdownToggle/classDropdownToggleSlice';
import { TextBox } from '../../../components/styled/TextBox';
import { v4 as uuidV4 } from 'uuid';
import { InputField } from '../../../components/styled/InputField';
import { FieldLabel } from '../../../components/styled/FieldLabel';
import { DashboardFormButton } from '../../../components/styled/DashboardFormButton.styled';
import { toast } from 'react-toastify';

function NewPostForm() {
    const dispatch = useDispatch();
    const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);

    const discussions = currentClass?.discussions.map(discussion => ({
        value: discussion,
        label: discussion,
    }));
    const [discussionList, setDiscussionList] = useState([]);

    let nameOptions = [
        { value: user.email, label: user.email },
    ];
    // if current class has anonymity on
    if (currentClass?.anonymity) {
        nameOptions.push({ value: 'Anonymous', label: 'Anonymous' });
    }

    const [showName, setShowName] = useState('');
    const [isValidationComplete, setIsValidationComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        c_id: currentClass?.c_id,
        created_by: user.email,
        type: '',
        summary: '',
        details: '',
        discussion_list: [],
        instructor_ans: '',
        student_ans: '',
        likes: 0,
        liked_by: [],
        total_comments: 0,
        show_name_as: '',
    });

    const { summary, details } = formData;


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (isValidationComplete) {
            // console.log('validation complete. database path is : ', `classes/${currentClass?.c_id}/posts`);
            const createPost = () => {
                try {
                    const postColRef = getColRef(`classes/${currentClass?.c_id}/posts`);
                    addDoc(postColRef, formData)
                        .then(() => {
                            console.log('post created in database.');

                            // really important part!
                            const individualStatsPostIncrement = async () => {
                                const individualStatsColRef = getColRef(`classes/${currentClass.c_id}/individual_stats`);
                                const queryIndividualStats = query(individualStatsColRef, where('user', '==', user.email));
                                const individualStatsSnapshot = await getDocs(queryIndividualStats);
                                let id;
                                if (individualStatsSnapshot.docs.length > 0) {
                                    id = individualStatsSnapshot.docs.at(0).id;

                                } else {
                                    id = uuidV4();
                                }
                                const individualStatsDocRef = getDocRefById(id, `classes/${currentClass.c_id}/individual_stats`);
                                await setDoc(individualStatsDocRef, {
                                    user: user.email,
                                    total_posts: increment(1),
                                    total_contributions: increment(1)
                                }, { merge: true });
                            };
                            const classStatsPostIncrement = async () => {
                                const classDocRef = getDocRefById(currentClass.c_id, 'classes');
                                if (formData.show_name_as === 'Anonymous') {
                                    await updateDoc(classDocRef, {
                                        total_posts: increment(1),
                                        total_contributions: increment(1),
                                        total_anonymous_contributions: increment(1)
                                    });
                                } else {
                                    await updateDoc(classDocRef, {
                                        total_posts: increment(1),
                                        total_contributions: increment(1)
                                    });
                                    individualStatsPostIncrement();
                                }
                            };
                            classStatsPostIncrement();
                        })
                    setIsLoading(false);
                    dispatch(toggleContent('other'));
                    dispatch(resetDropdown());
                } catch (err) {
                    console.log(err.message);
                    setIsLoading(false);
                }
            }
            createPost();
        }

    }, [isValidationComplete, currentClass, dispatch, formData])


    const handleSubmit = (e) => {
        e.preventDefault();

        if (showName.length === 0) {
            toast(`Please select a display name`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // do some validation
        setIsLoading(true);
        const finalDiscussions = discussionList?.map(discussion => discussion.value);
        console.log('finalDiscussions : ', finalDiscussions);
        setFormData((prevState) => {
            const newFormData = {
                ...prevState,
                show_name_as: showName.value,
                discussion_list: finalDiscussions,
            };
            // console.log('post to submit : ', newFormData);
            setIsValidationComplete(true);
            return newFormData;
        });

    }
    return (
        <>
            <div className='newpost_form_wrapper'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <FieldLabel>Post type : </FieldLabel>
                        <input type="radio" id="question"
                            name="type"
                            value="question"
                            onChange={onChange}
                            required
                        />
                        <label htmlFor="question">Question</label>

                        {/* <input type="radio" id="poll" name="type" value="question" />
                        <label htmlFor="poll">Poll</label> */}

                        <input type="radio" id="note"
                            name="type"
                            value="note"
                            onChange={onChange}
                            required
                        />
                        <label htmlFor="note">Note</label>
                    </div>
                    <div>
                        <FieldLabel>Select Discussion : </FieldLabel>
                        <Select
                            components={makeAnimated()}
                            options={discussions}
                            onChange={setDiscussionList}
                            placeholder='Please select discussion(s)'
                            noOptionsMessage={() => 'No discussions to select...'}
                            isMulti
                            isSearchable
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='new-post__summary'>Summary : </FieldLabel>
                        <InputField
                            id='new-post__summary'
                            type="text"
                            placeholder="Enter the summary here"
                            name="summary"
                            value={summary}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='new-post__details'>Details : </FieldLabel>
                        <TextBox
                            id='new-post__details'
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
                            options={nameOptions}
                            onChange={setShowName}
                            placeholder='Please select show name(s)'
                        />
                    </div>
                    <DashboardFormButton className='mg-top-btn' disabled={isLoading} type="submit">Create Post!</DashboardFormButton>
                </form>
            </div>
        </>
    );
}

export default NewPostForm;
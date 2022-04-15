import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../../features/user/userSlice';
import { getColRef } from '../../../firebase/firebase-firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { toggleContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { selectJoinedClasses } from '../../../features/classes/classSlice';
import { resetDropdown } from '../../../features/classDropdownToggle/classDropdownToggleSlice';
import { useNavigate } from 'react-router-dom';
import { TextBox } from '../../../components/styled/TextBox';
import { InputField } from '../../../components/styled/InputField';
import { FieldLabel } from '../../../components/styled/FieldLabel';
import { DashboardFormButton } from '../../../components/styled/DashboardFormButton.styled';

function CreateClass() {
    const user = useSelector(selectUser);
    const joinedClasses = useSelector(selectJoinedClasses);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialFormData = {
        created_at: serverTimestamp(),
        uni_id: user.uni_id,
        c_name: '',
        c_num: '',
        c_size: '',
        c_term: '',
        access_code: '',
        total_posts: 0,
        total_contributions: 0,
        total_anonymous_contributions: 0,
        total_deleted_contributions: 0,
        created_by: user.email,
        anonymity: true,
        discussions: [],
        joined_users: [user.email],
        instructors_list: [user.email],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [attendanceList, setAttendanceList] = useState('');

    const { c_name, c_num, c_size, c_term, anonymity, access_code } = formData;
    const [anonymous, setAnonymous] = useState(anonymity);
    const isAnonymous = (anonymous) ? true : false;

    const [isValidationComplete, setIsValidationComplete] = useState(false);
    const [readyToNavigate, setReadyToNavigate] = useState(false);

    useEffect(() => {
        if (isValidationComplete) {
            const createClass = () => {

                try {
                    const classColRef = getColRef('classes');
                    addDoc(classColRef, formData)
                        .then(() => {
                            console.log('class created in database.');
                            setIsLoading(false);
                            setReadyToNavigate(true);
                        })
                } catch (err) {
                    console.log(err.message);
                    setIsLoading(false);
                }
            }
            createClass();
        }
    }, [isValidationComplete]);

    useEffect(() => {
        if (readyToNavigate) {
            console.log('joinedClasses : ', joinedClasses);
            if (joinedClasses.length === 1) {
                console.log(`address is : /dashboard/${joinedClasses[0].c_id}`);
                dispatch(toggleContent('other'));
                dispatch(resetDropdown());
                navigate(`/dashboard/${joinedClasses[0].c_id}`);
            } else {
                console.log('I am here');
                dispatch(toggleContent('other'));
                dispatch(resetDropdown());
            }
        }
    }, [joinedClasses]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        // validate joined_users

        let test = [user.email];
        if (attendanceList?.length !== 0) {
            const regex = /[,;\s\r\n]/g;
            const attendance = attendanceList.split(regex);
            test = [...attendance.filter(String), user.email];
            console.log('attendance list is : ', test);
        }

        console.log('test value outside if is : ', test);
        // check if total class size exceeds
        if (test.length > c_size) {
            alert('Attendance list exceeds class size. Please remove some users from the list or change the class size.');
            return;
        }

        setFormData((prevState) => {
            const updatedFormData = {
                ...prevState,
                joined_users: [...test],
                anonymity: anonymous,
            };
            setIsValidationComplete(true);
            return updatedFormData;
        });

        // store class in database after validation

    };

    const handleRadioClick = () => {
        setAnonymous(prev => !prev);
    };

    return (
        <>
            <div className="create_class_form_wrapper">
                <form onSubmit={handleSubmit}>
                    <div>
                        <FieldLabel htmlFor='create-class__c-name'>Class Name :</FieldLabel>
                        <InputField
                            id='create-class__c-name'
                            type="text"
                            name='c_name'
                            value={c_name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='create-class__c-num'>Class Number :</FieldLabel>
                        <InputField
                            id='create-class__c-num'
                            type="text"
                            name='c_num'
                            value={c_num}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='create-class__c-size'>Class Size :</FieldLabel>
                        <InputField
                            id='create-class__c-size'
                            type="number"
                            min="0"
                            name='c_size'
                            value={c_size}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='create-class__c-term'>Class Term :</FieldLabel>
                        <InputField
                            id='create-class__c-term'
                            type="text"
                            name='c_term'
                            value={c_term}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='create-class__access-code'>Access Code (optional) :</FieldLabel>
                        <InputField
                            id='create-class__access-code'
                            type="text"
                            name='access_code'
                            value={access_code}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <FieldLabel>Class Anonymity :</FieldLabel>
                        <div>
                            <label htmlFor="anonymity-true">
                                <input
                                    type="radio"
                                    id='anonymity-true'
                                    name='anonymity'
                                    value={anonymous}
                                    checked={isAnonymous}
                                    onChange={handleRadioClick}
                                />
                                TRUE
                            </label>
                        </div>
                        <div>
                            <label htmlFor="anonymity-false">
                                <input
                                    type="radio"
                                    id='anonymity-false'
                                    name='anonymity'
                                    value={anonymous}
                                    checked={!isAnonymous}
                                    onChange={handleRadioClick}
                                />
                                FALSE
                            </label>
                        </div>
                    </div>
                    <div>
                        <FieldLabel htmlFor='create-class__attendance-list'>Attendance list :</FieldLabel>
                        <TextBox
                            id='create-class__attendance-list'
                            cols="30"
                            rows="10"
                            placeholder="(please write emails of class participants on new line)"
                            name="attendanceList"
                            value={attendanceList}
                            onChange={(e) => { setAttendanceList(e.target.value) }}
                        />
                    </div>
                    <DashboardFormButton disabled={isLoading} type="submit">Create Class!</DashboardFormButton>
                </form>
            </div>
        </>
    );
}

export default CreateClass;
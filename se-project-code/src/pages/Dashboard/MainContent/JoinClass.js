import { getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getColRef, getDocRefById } from '../../../firebase/firebase-firestore';
import { selectJoinedClasses } from '../../../features/classes/classSlice';
import { selectUser } from '../../../features/user/userSlice';
import { toggleContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { resetDropdown } from '../../../features/classDropdownToggle/classDropdownToggleSlice';
import { useNavigate } from 'react-router-dom';
import { InputField } from '../../../components/styled/InputField';
import { FieldLabel } from '../../../components/styled/FieldLabel';
import { DashboardFormButton } from '../../../components/styled/DashboardFormButton.styled';

function JoinClass() {
    const [formData, setFormData] = useState({
        c_name: '',
        c_num: '',
        c_term: '',
        access_code: ''
    });
    const { c_name, c_num, c_term, access_code } = formData;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const joinedClasses = useSelector(selectJoinedClasses);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [readyToNavigate, setReadyToNavigate] = useState(false);
    const [joinAs, setJoinAs] = useState('student');
    const joinAsOptions = [
        { value: 'student', label: 'student' },
        { value: 'instructor', label: 'Anonymous' }
    ];


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

    const validate = () => {
        if (joinedClasses.length === 0) {
            return true;
        } else {
            for (let i = 0; i < joinedClasses?.length; i++) {
                if (
                    joinedClasses[i].c_name === c_name &&
                    joinedClasses[i].c_num === c_num &&
                    joinedClasses[i].c_term === c_term &&
                    joinedClasses[i].access_code === access_code

                ) {
                    // this means you already joined this class
                    return false;
                }
            }
            return true;
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const isSafeToJoin = validate();

        if (isSafeToJoin) {
            setIsSubmitting(true);
            const joinTheClass = async () => {
                try {
                    const classColRef = getColRef('classes');
                    const joinClassQuery = query(classColRef,
                        where('uni_id', '==', `${user.uni_id}`),
                        where('c_name', '==', `${c_name}`),
                        where('c_num', '==', `${c_num}`),
                        where('c_term', '==', `${c_term}`),
                        where('access_code', '==', `${access_code}`),
                        orderBy('created_at', 'desc')
                    )
                    const querySnapshot = await getDocs(joinClassQuery);
                    const class_id = querySnapshot.docs[0]?.id;

                    // now update the class

                    if (class_id != undefined && class_id !== null) {
                        let new_joined_users = querySnapshot.docs[0]?.data().joined_users;
                        if (new_joined_users.length + 1 > parseInt(querySnapshot.docs[0]?.data().c_size)) {
                            toast(`This class is full... cannot join.`, {
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
                        new_joined_users?.push(user.email);
                        const classDocRef = getDocRefById(class_id, 'classes');
                        if (joinAs === 'instructor') {
                            let new_instructors_list = querySnapshot.docs[0]?.data().instructors_list;
                            new_instructors_list?.push(user.email);
                            await updateDoc(classDocRef, {
                                instructors_list: [...new_instructors_list],
                                joined_users: [...new_joined_users]
                            });
                        } else {
                            await updateDoc(classDocRef, {
                                joined_users: [...new_joined_users]
                            });
                        }

                        toast(`You've successfully joined this class... check your classes.`, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        setReadyToNavigate(true);
                    } else {
                        toast(`Can't join this class.. No such class exists... Or maybe try checking the access code`, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        dispatch(toggleContent('other'));
                        dispatch(resetDropdown());
                    }

                    setIsSubmitting(false);


                } catch (error) {
                    toast(error.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setIsSubmitting(false);
                }
            }
            joinTheClass();

        } else {
            toast(`You've already joined this class! Or the access code might be incorrect...`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }


    return (
        <>
            <div className="create_class_form_wrapper">
                <form onSubmit={handleSubmit}>
                    <div>
                        <FieldLabel htmlFor='join-class__c-name'>Class Name :</FieldLabel>
                        <InputField
                            id='join-class__c-name'
                            type="text"
                            name='c_name'
                            value={c_name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='join-class__c-num'>Class Number :</FieldLabel>
                        <InputField
                            id='join-class__c-num'
                            type="text"
                            name='c_num'
                            value={c_num}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='join-class__c-term'>Class Term :</FieldLabel>
                        <InputField
                            id='join-class__c-term'
                            type="text"
                            name='c_term'
                            value={c_term}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor='join-class__access-code'>Access Code (optional) :</FieldLabel>
                        <InputField
                            id='join-class__access-code'
                            type="text"
                            name='access_code'
                            value={access_code}
                            onChange={onChange}
                        />
                    </div>

                    {/* {
                        user.role === 'instructor'
                        &&
                        <div>
                            <p>Join as : </p>
                            <Select
                                options={joinAsOptions}
                                onChange={setJoinAs}
                                placeholder='Please select an option'
                            />
                        </div>
                    } */}
                    <DashboardFormButton disabled={isSubmitting} type="submit">Join Class!</DashboardFormButton>
                </form>
            </div>
        </>
    );
}

export default JoinClass;
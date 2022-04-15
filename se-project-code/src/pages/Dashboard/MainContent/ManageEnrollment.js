import { arrayRemove, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { getDocRefById } from '../../../firebase/firebase-firestore';
import { selectUser } from '../../../features/user/userSlice';
import { TextBox } from '../../../components/styled/TextBox';
import { MinusIcon } from '../../../components/styled/MinusIcon';
import styled from 'styled-components';
import { FieldLabel } from '../../../components/styled/FieldLabel';
import { DashboardFormButton } from '../../../components/styled/DashboardFormButton.styled';

function ManageEnrollment() {
    const user = useSelector(selectUser);
    const currentClass = useSelector(selectCurrentClass);
    const [joinedUsersList, setJoinedUsersList] = useState(currentClass.joined_users);
    const [attendanceList, setAttendanceList] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setJoinedUsersList([...currentClass.joined_users]);
    }, [currentClass]);

    const handleDrop = (joined_user_list) => {
        if (joined_user_list[0] === user.email) {
            const userWannaLeave = window.confirm('Are you sure you want to leave this class?');
            if (!userWannaLeave) {
                return
            }
        }
        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        console.log('joined_user_list : ', joined_user_list);
        updateDoc(classDocRef, {
            joined_users: arrayRemove(...joined_user_list)
        })
            .then(() => {
                console.log('removed the user successfully.');
            })
            .catch(err => console.log(err.message))
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        // validate joined_users

        let test = [];
        if (attendanceList?.length !== 0) {
            const regex = /[,;\s\r\n]/g;
            const attendance = attendanceList.split(regex);
            test = [...attendance.filter(String)];
            console.log('attendance list is : ', test);
        }

        console.log('test length outside if is : ', test.length);
        // check if total class size exceeds
        if (joinedUsersList.length + test.length > currentClass.c_size) {
            alert('Attendance list exceeds class size. Please remove some users from the list or change the class size.');
            setIsLoading(false);
            return;
        }

        // check domain names for emails
        const userEmailSplit = user.email.split('@');
        const userDomainName = userEmailSplit[userEmailSplit.length - 1];
        if (
            test.every((email) => {
                const emailSplit = email.split('@');

                const domainName = emailSplit[emailSplit.length - 1];
                return domainName === userDomainName;
            })
        ) {
            if (test.every((email) => !joinedUsersList.includes(email))) {
                // no email in attendance list is present in current class joined user list
                const newJoinedUsers = [...joinedUsersList, ...test];
                console.log('new joined users are : ', newJoinedUsers);
                const classDocRef = getDocRefById(currentClass.c_id, 'classes');
                updateDoc(classDocRef, {
                    joined_users: [...newJoinedUsers]
                })
                    .then(() => {
                        console.log('updated attendance list successfully.');
                        setAttendanceList('');
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.log(err.message);
                        setIsLoading(false);
                    })
            }
        } else {
            alert('You can only enroll users from your University.');
            setIsLoading(false);
            return;
        }
    }

    return (
        <div>
            <FieldLabel htmlFor='enroll-students-textbox'>ENROLL STUDENTS :</FieldLabel>
            <div>
                <form onSubmit={handleSubmit}>

                    <TextBox
                        id='enroll-students-textbox'
                        cols="30"
                        rows="10"
                        placeholder="(please write emails of class participants on new line)"
                        name="attendanceList"
                        value={attendanceList}
                        onChange={(e) => { setAttendanceList(e.target.value) }}
                        required
                    />
                    <DashboardFormButton disabled={isLoading} type="submit">Enroll</DashboardFormButton>
                </form>
            </div>
            <EnrollmentListContainer>
                <FieldLabel>JOINED USERS :</FieldLabel>
                {joinedUsersList.map((joinedUser) => (
                    <EnrollmentList key={joinedUser}>
                        <div>{joinedUser}</div>
                        <MinusIcon
                            onClick={() => handleDrop([joinedUser])}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </MinusIcon>
                    </EnrollmentList>
                ))}
            </EnrollmentListContainer>
        </div>
    );
}

const EnrollmentListContainer = styled.div`
    margin-top: var(--post-card-margin);
    display: flex;
    flex-direction: column;
    /* margin-top: var(--post-card-margin); */
    gap: var(--post-card-margin);
    
    & > label {
        margin-bottom: 0;
    }
`

const EnrollmentList = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: calc(var(--post-card-margin) / 2);
`

export default ManageEnrollment;
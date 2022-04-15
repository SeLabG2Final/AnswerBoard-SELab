import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';
import { reset, selectUser, selectUserStatus, signup } from '../../features/user/userSlice';
import { getAllDocsFrom, getColRef } from '../../firebase/firebase-firestore';
import Select from 'react-select';

// below is code for university input field that was used before

// {formStep === 0 && (
//     <section>
//         <StyledFormDiv>
//             <StyledInput
//                 type="text"
//                 id="university"
//                 placeholder=" "
//                 name="university"
//                 value={university}
//                 onChange={onChange}
//                 onFocus={() => setShowUni(true)}
//             />
//             <StyledLabel
//                 className="form__label"
//                 htmlFor="university"
//             >
//                 University
//             </StyledLabel>
//         </StyledFormDiv>
//         {
//             showUni
//             &&
//             <div>
//                 {
//                     filteredUniList.length > 0
//                         ? filteredUniList.map(uni => (
//                             <div
//                                 key={uni.id}
//                                 onClick={() => {
//                                     setFormData((prevState) => ({
//                                         ...prevState,
//                                         ['university']: uni.name,
//                                     }));
//                                 }}
//                             >
//                                 <p>{uni.name}</p>
//                             </div>
//                         ))
//                         : (
//                             <p>No Universities like this</p>
//                         )
//                 }
//             </div>

//         }
//         <StyledButton
//             onClick={() =>
//                 setFormStep((currStep) => currStep + 1)
//             }

//         >
//             Next
//         </StyledButton>
//     </section>
// )}

function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        role: ''
    });
    const { username, email, password, confirmPassword, university, role } = formData;
    const [formStep, setFormStep] = useState(0);
    const [isValidationComplete, setIsValidationComplete] = useState(false);

    const user = useSelector(selectUser);
    const { isLoading, isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [allUniList, setAllUniList] = useState([]);
    const [filteredUniList, setFilteredUniList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const roleOptions = [
        { value: 'instructor', label: 'instructor' },
        { value: 'student', label: 'student' }
    ];
    const [isSelectingUni, setIsSelectingUni] = useState(false);

    useEffect(() => {
        // gets all universities from database
        const getAllUniversities = async () => {
            try {
                const universityColRef = getColRef('universities');
                const allUniversities = await getAllDocsFrom(universityColRef);
                setAllUniList([...allUniversities]);
                const uniOptions = allUniversities.map(uni => ({
                    value: uni.name,
                    label: uni.name,
                }));
                setFilteredUniList([...uniOptions]);
            } catch (error) {
                console.log(error.message);
            }
        };

        getAllUniversities();
    }, []);

    useEffect(() => {
        if (isError) {
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        if (isSuccess) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);


    useEffect(() => {
        if (JSON.stringify(formErrors) === '{}') {

            if (isValidationComplete) {
                // get id of university
                const univ = allUniList.filter((uni) => university === uni.name);
                const userData = {
                    uni_id: univ[0].id,
                    role,
                    username,
                    email: email.toLowerCase(),
                    password
                };
                // console.log(userData);
                dispatch(signup(userData));
            }
        } else {
            setIsValidationComplete(false);
        }
    }, [isValidationComplete]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value.trim(),
        }));
    };

    const validateUni = () => {
        const errors = {};
        if (university.length === 0) {
            errors.university = 'Please enter a university first';
        }
        return errors;
    }

    const validateRole = () => {
        const errors = {};
        if (role.length === 0) {
            errors.role = 'Please enter a role first';
        }
        return errors;
    }

    const validate = (data) => {
        const errors = {};
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;
        const univ = allUniList.filter((uni) => university === uni.name);
        const checkUniStr = `@${univ[0].domain_name}$`;
        const checkUniRegex = new RegExp(checkUniStr);

        if (!data.username) {
            errors.username = 'Username is required';
        }
        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!regex.test(data.email)) {
            errors.email = 'Email is invalid. Enter e.g test@test.com';
        } else if (!checkUniRegex.test(data.email)) {
            // check email with university domain name
            errors.email = 'Email should belong to the same university';
        }
        if (!data.password) {
            errors.password = 'Password is required';
        } else if (data.password.length < 6) {
            errors.password = 'Password should be at least 6 characters long';
        } else if (data.confirmPassword !== data.password) {
            errors.confirmPassword = 'Passwords should match';
        }
        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // validate the form here

        setFormErrors(validate(formData));

        // now just create new user and store them in firebase
        setIsValidationComplete(true);
    };


    return (
        <>
            <StyledFormWrapper>
                <StyledForm autoComplete="off" onSubmit={onSubmit}>
                    {formStep > 0 && (
                        <section>
                            <StyledLeftBackIcon
                                onClick={() => setFormStep((currStep) => currStep - 1)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </StyledLeftBackIcon>
                        </section>
                    )}
                    <StyledTitle>Sign-Up</StyledTitle>
                    {formStep === 0 && (
                        <section>
                            <StyledFormDiv>
                                <Select
                                    options={filteredUniList}
                                    value={(university.length > 0) ? { value: university, label: university } : null}
                                    onChange={(e) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            ['university']: (e) ? e.value : '',
                                        }));
                                    }}
                                    placeholder=''
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => 'No such University found'}
                                />
                                <div className='error-field'>
                                    <p>{formErrors.university}</p>
                                </div>
                            </StyledFormDiv>
                            <StyledButton
                                type='button'
                                onClick={() => {
                                    const errors = validateUni();
                                    setFormErrors(errors);
                                    if (errors.university) {
                                        return
                                    } else {
                                        setFormStep((currStep) => currStep + 1)
                                    }
                                }}
                            >
                                Next
                            </StyledButton>
                        </section>
                    )}
                    {formStep === 1 && (
                        <section>
                            <StyledFormDiv>
                                <Select
                                    options={roleOptions}
                                    value={(role.length > 0) ? { value: role, label: role } : null}
                                    onChange={(e) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            ['role']: (e) ? e.value : '',
                                        }));
                                    }}
                                    placeholder=''
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => 'No such role exist'}
                                />
                                <div className='error-field'>
                                    <p>{formErrors.role}</p>
                                </div>
                            </StyledFormDiv>
                            <StyledButton
                                type='button'
                                onClick={() => {
                                    const errors = validateRole();
                                    setFormErrors(errors);
                                    if (errors.role) {
                                        return
                                    } else {
                                        setFormStep((currStep) => currStep + 1)
                                    }
                                }}
                            >
                                Next
                            </StyledButton>
                        </section>
                    )}
                    {formStep === 2 && (
                        <section>
                            <StyledFormDiv>
                                <StyledInput
                                    type="text"
                                    id="username"
                                    placeholder=" "
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="username"
                                >
                                    Username
                                </StyledLabel>
                            </StyledFormDiv>
                            <div className='error-field'>
                                <p>{formErrors.username}</p>
                            </div>
                            <StyledFormDiv>
                                <StyledInput
                                    type="text"
                                    id="email"
                                    placeholder=" "
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="Email"
                                >
                                    Email
                                </StyledLabel>
                            </StyledFormDiv>
                            <div className='error-field'>
                                <p>{formErrors.email}</p>
                            </div>
                            <StyledFormDiv>
                                <StyledInput
                                    type="password"
                                    id="password"
                                    placeholder=" "
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="password"
                                >
                                    Password
                                </StyledLabel>
                            </StyledFormDiv>
                            <div className='error-field'>
                                <p>{formErrors.password}</p>
                            </div>
                            <StyledFormDiv>
                                <StyledInput
                                    type="password"
                                    id="confirmPassword"
                                    placeholder=" "
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password
                                </StyledLabel>
                            </StyledFormDiv>
                            <div className='error-field'>
                                <p>{formErrors.confirmPassword}</p>
                            </div>
                            <StyledButton disabled={isLoading} type="submit">Sign-Up</StyledButton>
                        </section>
                    )}

                    <p className='form__login-para'>Already have an account? </p>
                    <StyledLink to="/login">Login here!</StyledLink>
                </StyledForm>
            </StyledFormWrapper>
        </>
    );
}

export default SignUp;

const StyledLeftBackIcon = styled.svg`
    width: 1.5em;
    cursor: pointer;
    margin-bottom: var(--field-margin);

    &:hover {
        color: var(--secondary-color);
    }
`
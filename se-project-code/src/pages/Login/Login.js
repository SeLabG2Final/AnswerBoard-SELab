import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';
import { login, reset, selectUser, selectUserStatus } from '../../features/user/userSlice';


function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const user = useSelector(selectUser);
    const { isLoading, isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [isValidationComplete, setIsValidationComplete] = useState(false);

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
                const userData = {
                    email: email.toLowerCase(),
                    password
                };
                dispatch(login(userData));
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

    const validate = (data) => {
        const errors = {};
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;

        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!regex.test(data.email)) {
            errors.email = 'Email is invalid. Enter e.g test@test.com';
        }
        if (!data.password) {
            errors.password = 'Password is required';
        }
        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setFormErrors(validate(formData));

        setIsValidationComplete(true);
    };

    const { email, password } = formData;

    return (
        <>
            <StyledFormWrapper>
                <StyledForm autoComplete="off" onSubmit={onSubmit}>
                    <StyledTitle>Welcome!</StyledTitle>
                    <StyledFormDiv>
                        <StyledInput
                            type="text"
                            id="email"
                            placeholder=" "
                            name="email"
                            value={email}
                            onChange={onChange}
                        />
                        <StyledLabel className="form__label" htmlFor="email">Email</StyledLabel>
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
                        <StyledLabel className="form__label" htmlFor="password">Password</StyledLabel>
                    </StyledFormDiv>
                    <div className='error-field'>
                        <p>{formErrors.password}</p>
                    </div>
                    <StyledButton disabled={isLoading} type="submit">Login</StyledButton>
                    <p className='form__signup-para'>Don't have an account? </p>
                    <StyledLink to="/signup">Sign-up here!</StyledLink>
                </StyledForm>
            </StyledFormWrapper>
        </>
    );
}

export default Login;
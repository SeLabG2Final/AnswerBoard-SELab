// features/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, logoutUser, signupUser } from '../../firebase/firebase-auth';
import { setDoc, getDoc, getDocRefById } from '../../firebase/firebase-firestore';

// get user from local storage
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

export const signup = createAsyncThunk('user/signup', async (user, thunkAPI) => {
    try {
        const { password, ...userDataWithoutPassword } = user;

        // signup new user with firebase auth
        const userCredentials = await signupUser(user.email, user.password);
        const uid = userCredentials.user.uid;
        const newUserData = { ...userDataWithoutPassword, uid };

        // store new user in database
        const userDocRef = getDocRefById(uid, 'users');
        await setDoc(userDocRef, userDataWithoutPassword);

        localStorage.setItem('currentUser', JSON.stringify(newUserData));
        return newUserData;

    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk('user/login', async (user, thunkAPI) => {
    try {
        const userCredentials = await loginUser(user.email, user.password);
        const uid = userCredentials.user.uid;

        // get logged in user with given id from database
        const userDocRef = getDocRefById(uid, 'users');
        const docSnap = await getDoc(userDocRef);
        const userData = docSnap.data();
        const newUserData = { ...userData, uid };

        localStorage.setItem('currentUser', JSON.stringify(newUserData));
        return newUserData;

    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('user/logout', async (thunkAPI) => {
    try {
        await logoutUser();
        localStorage.removeItem('currentUser');
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    user: currentUser ? currentUser : null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // for signup
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            // for login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            // for logout
            .addCase(logout.fulfilled, (state) => {
                state.isSuccess = true;
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
    }
});

// export synchronous actions
export const { reset } = userSlice.actions;

// selectors
export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => ({
    isLoading: state.user.isLoading,
    isError: state.user.isError,
    isSuccess: state.user.isSuccess,
    message: state.user.message
});

// reducer
export default userSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs } from 'firebase/firestore';
import { getColRef } from '../../firebase/firebase-firestore';

export const getAllPosts = createAsyncThunk('posts/getAllPosts', async (class_id, thunkAPI) => {
    try {
        // get all info for joined classes of a given user from database
        const postColRef = getColRef(`classes/${class_id}/posts`);
        const snapshot = await getDocs(postColRef);
        const promises = snapshot.docs.map(async (doc) => {
            return {
                p_id: doc.id,
                ...doc.data()
            };
        });
        const posts = await Promise.all(promises);
        return posts;
    }
    catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    currentPost: null,
    allPosts: [],
    currentDiscussion: '',
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

export const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        resetPosts: (state) => {
            state.currentPost = null;
            state.allPosts = [];
            state.currentDiscussion = '';
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        getPosts: (state, action) => {
            state.allPosts = action.payload;
        },
        updateCurrentDiscussion: (state, action) => {
            state.currentDiscussion = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // for getAllPosts
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.allPosts = action.payload;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.allPosts = [];
            })
    }
});

// export synchronous actions
export const { resetPosts, reset, getPosts, updateCurrentDiscussion } = postSlice.actions;

// selectors
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectCurrentDiscussion = (state) => state.posts.currentDiscussion;
export const selectAllPosts = (state) => state.posts.allPosts;
export const selectPostStatus = (state) => ({
    isLoading: state.posts.isLoading,
    isError: state.posts.isError,
    isSuccess: state.classes.isSuccess,
    message: state.posts.message
});

// reducer
export default postSlice.reducer;
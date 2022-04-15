import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDoc, getDocRefById } from '../../firebase/firebase-firestore';

// get user from local storage
const localCurrentClass = JSON.parse(localStorage.getItem('currentClass'));

export const getJoinedClasses = createAsyncThunk('class/getJoinedClasses', async (user, thunkAPI) => {
    if (user.class_joined.length === 0) {
        return [];
    } else {
        try {
            // get all info for joined classes of a given user from database

            const promises = user.class_joined.map(async (class_id) => {
                const classDocRef = getDocRefById(class_id, 'classes');
                const docSnap = await getDoc(classDocRef);
                return {
                    c_id: class_id,
                    ...docSnap.data()
                };
            });
            const joined_classes = await Promise.all(promises);

            return joined_classes;
        }
        catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
                || error.message
                || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
});

const initialState = {
    currentClass: localCurrentClass ? localCurrentClass : null,
    joinedClasses: [],
    createdClasses: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

export const classSlice = createSlice({
    name: 'classes',
    initialState,
    reducers: {
        resetClasses: (state) => {
            state.currentClass = null;
            state.joinedClasses = [];
            state.createdClasses = [];
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
        updateCurrentClass: (state, action) => {
            state.currentClass = action.payload;
            localStorage.setItem('currentClass', JSON.stringify(state.currentClass));
        },
        updateJoinedClasses: (state, action) => {
            state.joinedClasses = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // for getJoinedClasses
            .addCase(getJoinedClasses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJoinedClasses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.joinedClasses = action.payload;
                if (state.joinedClasses.length !== 0) {
                    if (state.currentClass === null || state.currentClass == undefined) {
                        state.currentClass = state.joinedClasses[0];
                        localStorage.setItem('currentClass', JSON.stringify(state.currentClass));
                    } else {
                        // check if the current class exists in joined class list
                        const currCls = state.joinedClasses.filter(cls => cls.c_id === state.currentClass?.c_id);
                        if (currCls.length === 0) {
                            state.currentClass = state.joinedClasses[0];
                            localStorage.setItem('currentClass', JSON.stringify(state.currentClass));
                        }
                    }
                }
            })
            .addCase(getJoinedClasses.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.joinedClasses = [];
            })
    }
});

// export synchronous actions
export const { resetClasses, reset, updateCurrentClass, updateJoinedClasses } = classSlice.actions;

// selectors
export const selectCurrentClass = (state) => state.classes.currentClass;
export const selectJoinedClasses = (state) => state.classes.joinedClasses;
export const selectCreatedClasses = (state) => state.classes.createdClasses;
export const selectClassesStatus = (state) => ({
    isLoading: state.classes.isLoading,
    isError: state.classes.isError,
    isSuccess: state.classes.isSuccess,
    message: state.classes.message
});

// reducer
export default classSlice.reducer;
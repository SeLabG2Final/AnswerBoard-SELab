import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    main_content: 'welcome',
    manage_class: 'general'
};

export const mainContentToggleSlice = createSlice({
    name: 'mainContent',
    initialState,
    reducers: {
        toggleContent: (state, action) => {
            state.main_content = action.payload;
        },
        toggleManageClass: (state, action) => {
            state.manage_class = action.payload;
        },
        resetMainContent: (state) => {
            state.main_content = 'welcome';
            state.manage_class = 'general';
        }
    },
});

// actions
export const { toggleContent, toggleManageClass, resetMainContent } = mainContentToggleSlice.actions;

// selector
export const selectMainContent = (state) => state.mainContent.main_content;
export const selectManageClass = (state) => state.mainContent.manage_class;

// reducer
export default mainContentToggleSlice.reducer;
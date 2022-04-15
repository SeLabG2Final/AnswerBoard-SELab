import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show: false
}

export const classDropdownToggleSlice = createSlice({
    name: 'toggleClassDropdown',
    initialState,
    reducers: {
        toggleDropdown: (state) => {
            state.show = !state.show;
        },
        resetDropdown: (state) => {
            state.show = false;
        }
    },
});

// actions
export const { toggleDropdown, resetDropdown } = classDropdownToggleSlice.actions;

// selector
export const selectShowDropdown = (state) => state.toggleClassDropdown.show;

// reducer
export default classDropdownToggleSlice.reducer;

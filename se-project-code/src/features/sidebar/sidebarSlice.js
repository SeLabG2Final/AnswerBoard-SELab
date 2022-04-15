import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSide: false,
    showMore: false
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.showSide = !state.showSide;
        },
        showSidebar: (state) => {
            state.showSide = true;
        },
        hideSidebar: (state) => {
            state.showSide = false;
        },
        toggleMore: (state) => {
            state.showMore = !state.showMore;
        },
        showMoreMenu: (state) => {
            state.showMore = true;
        },
        hideMoreMenu: (state) => {
            state.showMore = false;
        }
    },
});

// actions
export const {
    toggleSidebar,
    showSidebar,
    hideSidebar,
    toggleMore,
    showMoreMenu,
    hideMoreMenu
} = sidebarSlice.actions;

// selector
export const selectSidebarStatus = (state) => state.sidebar.showSide;
export const selectMoreMenuStatus = (state) => state.sidebar.showMore;

// reducer
export default sidebarSlice.reducer;

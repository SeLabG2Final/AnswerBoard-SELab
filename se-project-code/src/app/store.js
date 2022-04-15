//src/app/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import mainContentToggleReducer from '../features/mainContentToggle/mainContentToggleSlice';
import classDropdownToggleSlice from '../features/classDropdownToggle/classDropdownToggleSlice';
import classesReducer from '../features/classes/classSlice';
import postReducer from '../features/posts/postSlice';
import sidebarReducer from '../features/sidebar/sidebarSlice';

const combinedReducer = combineReducers({
    user: userReducer,
    classes: classesReducer,
    posts: postReducer,
    mainContent: mainContentToggleReducer,
    toggleClassDropdown: classDropdownToggleSlice,
    sidebar: sidebarReducer,
});


const rootReducer = (state, action) => {
    if (action.type === 'user/logout') {
        state = undefined;
    }
    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});



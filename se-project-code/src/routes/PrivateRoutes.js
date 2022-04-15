import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUser } from '../features/user/userSlice';

function PrivateRoutes() {
    const user = useSelector(selectUser);
    const location = useLocation();
    return (
        user ? <Outlet />
            : <Navigate to='/login' state={{ from: location }} replace />
    );
}

export default PrivateRoutes;
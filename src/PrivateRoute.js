import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Get role from localStorage

    // Allow only Doctors and Admins
    if (!token || (role !== 'Admin' && role !== 'Doctor')) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;

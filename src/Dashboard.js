import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Inside useEffect. Token:', token); // Debug statement
        if (!token) {
            console.log('No token found. Redirecting to login...');
            navigate('/');
            return; // Ensure no further rendering of the component
        }
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome to the Dashboard</h1>
            <div className="dashboard-links">
                <a href="/patients" className="dashboard-link">Patients</a>
                <a href="/doctors" className="dashboard-link">Doctors</a>
                <a href="/appointments" className="dashboard-link">Appointments</a>
                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.removeItem('token'); // Remove the token
                        localStorage.removeItem('role'); // Remove the role
                        window.location.href = '/'; // Redirect to login
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;

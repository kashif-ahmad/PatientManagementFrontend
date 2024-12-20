import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import Patients from './Patients';  // Patient component imported
import Doctors from './Doctors';  // Doctor component imported
import Appointments from './Appointments';  // Appointment component imported
import './App.css';

// const Patients = () => <h2>Patients Page</h2>;
// const Doctors = () => <h2>Doctors Page</h2>;
// const Appointments = () => <h2>Appointments Page</h2>;

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public route */}
                <Route path="/" element={<Login />} />

                {/* Secured routes */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patients"
                    element={
                        <PrivateRoute>
                            <Patients />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctors"
                    element={
                        <PrivateRoute>
                            <Doctors />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/appointments"
                    element={
                        <PrivateRoute>
                            <Appointments />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;

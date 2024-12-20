import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('https://localhost:7190/api/Users/Login', {
                username,
                passwordHash: password,
            });

            console.log('API Response:', response.data);

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role); // Save role in localStorage
                localStorage.setItem('userNo', response.data.userNo); // Save userNo in localStorage
                console.log('Role saved to localStorage:', response.data.role);

                // Redirect based on role
                navigate('/dashboard');
            } else {
                setError('Login failed: No token received.');
                console.log('No token received in response.');
            }
        } catch (err) {
            console.error('Login failed:', err.response?.data || err.message);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
